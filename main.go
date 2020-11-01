package main

import (
	"crypto/tls"
	"log"
	"net/http"
	"regexp"
	"runtime/debug"
	"strconv"
	"strings"
	"time"
	"unicode"

	"github.com/PuerkitoBio/goquery"
	"github.com/gin-gonic/gin"
)

// LiuliList 琉璃神社数据列表
type LiuliList struct {
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Img         string   `json:"img"`
	Time        string   `json:"time"`
	Tag         []string `json:"type"`
	MoreLink    string   `json:"moreLink"`
}

// LiuliData 琉璃神社数据明细
type LiuliData struct {
	Current int         `json:"current"`
	Total   int         `json:"total"`
	Data    []LiuliList `json:"data"`
}

// Liuli 琉璃神社数据
type Liuli struct {
	Status int       `json:"status"`
	Data   LiuliData `json:"data"`
}

// ErrMessage 返回的错误信息
type ErrMessage struct {
	Status int    `json:"status"`
	Data   string `json:"error"`
}

// SucessData SucessData
type SucessData struct {
	Status int    `json:"status"`
	Data   string `json:"data"`
}

// Recover 异常获取
func Recover(c *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			//打印错误堆栈信息
			log.Printf("panic: %v\n", r)
			debug.PrintStack()
			//封装通用json返回
			//c.JSON(http.StatusOK, Result.Fail(errorToString(r)))
			//Result.Fail不是本例的重点，因此用下面代码代替
			c.JSON(http.StatusOK, gin.H{
				"code": "1",
				"msg":  errorToString(r),
				"data": nil,
			})
			//终止后续接口调用，不加的话recover到异常后，还会继续执行接口里后续代码
			c.Abort()
		}
	}()
	//加载完 defer recover，继续后续接口调用
	c.Next()
}

// recover错误，转string
func errorToString(r interface{}) string {
	switch v := r.(type) {
	case error:
		return v.Error()
	default:
		return r.(string)
	}
}

// IsChineseChar 判断是否包含中文
func isChineseChar(str string) bool {
	for _, r := range str {
		if unicode.Is(unicode.Scripts["Han"], r) || (regexp.MustCompile("[\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]").MatchString(string(r))) {
			return true
		}
	}
	return false
}

func main() {
	r := gin.Default()

	r.Use(Recover)

	r.LoadHTMLGlob("build/index.html")
	r.Static("/static/", "./build/static/")
	r.StaticFile("/favicon.ico", "./html/favicon.ico")

	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{
			"title": "Main website",
		})
	})

	r.GET("/api", func(c *gin.Context) {
		pageIndex := c.Query("pageIndex")
		queryType := c.Query("type")

		url := "https://www.hacg.tw/wp/"
		if queryType != "all" {
			url += "/category/all/" + queryType + "/"
		}
		url += "page/" + pageIndex + "/"
		tr := &http.Transport{ //解决x509: certificate signed by unknown authority
			TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
		}
		client := &http.Client{
			Timeout:   15 * time.Second,
			Transport: tr, //解决x509: certificate signed by unknown authority
		}
		res, err := client.Get(url)
		if err != nil {
			log.Println(err)
			c.JSON(200, ErrMessage{
				1,
				"页面解析异常",
			})
			return
		}
		defer res.Body.Close()
		if res.StatusCode != 200 {
			log.Println(err)
			c.JSON(200, ErrMessage{
				1,
				"页面解析异常",
			})
			return
		}

		// Load the HTML document
		doc, err := goquery.NewDocumentFromReader(res.Body)
		if err != nil {
			log.Println(err)
			c.JSON(200, ErrMessage{
				1,
				"页面解析异常",
			})
			return
		}

		liuliItems := []LiuliList{}

		// Find the review items
		doc.Find(".status-publish").Each(func(i int, s *goquery.Selection) {
			title := s.Find(".entry-title").Find("a").Text()
			time := s.Find(".entry-date").Text()
			img, exists := s.Find(".entry-content").Find("img").Attr("src")
			moreLink, _ := s.Find(".more-link").Attr("href")
			if !exists {
				img = ""
			}
			description := s.Find(".entry-content").Find("p").Text()
			tag := s.Find(".cat-links").Find("a").Map(func(i int, s *goquery.Selection) string {
				return s.Text()
			})
			liuliItem := LiuliList{
				Time:        time,
				Title:       title,
				Img:         img,
				Description: description,
				Tag:         tag,
				MoreLink:    moreLink,
			}
			liuliItems = append(liuliItems, liuliItem)
		})

		pageText := doc.Find(".wp-pagenavi").Find(".pages").Text()
		total, _ := strconv.Atoi(strings.Split(pageText, " ")[3])

		c.JSON(200, Liuli{
			Status: 0,
			Data: LiuliData{
				Current: 1,
				Total:   total,
				Data:    liuliItems,
			},
		})
	})

	r.GET("/api/url", func(c *gin.Context) {
		url := c.Query("url")
		tr := &http.Transport{ //解决x509: certificate signed by unknown authority
			TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
		}
		client := &http.Client{
			Timeout:   15 * time.Second,
			Transport: tr, //解决x509: certificate signed by unknown authority
		}
		res, err := client.Get(url)
		if err != nil {
			c.JSON(200, ErrMessage{
				1,
				"页面解析异常",
			})
			return
		}
		defer res.Body.Close()
		if res.StatusCode != 200 {
			c.JSON(200, ErrMessage{
				1,
				"页面解析异常",
			})
			return
		}

		// Load the HTML document
		doc, err := goquery.NewDocumentFromReader(res.Body)
		if err != nil {
			c.JSON(200, ErrMessage{
				1,
				"页面解析异常",
			})
			return
		}

		texts := strings.Split(doc.Find(".entry-content").Text(), "\n")
		downloadURL := ""
		for _, text := range texts {
			for _, t := range strings.Split(text, " ") {
				if len(t) == 40 && !isChineseChar(t) {
					downloadURL += "magnet:?xt=urn:btih:" + t
				}
			}
		}

		if len(downloadURL) == 0 {
			c.JSON(200, ErrMessage{
				1,
				"无法解析成下载链接:" + downloadURL,
			})
			return
		}

		c.JSON(200, SucessData{
			0, downloadURL,
		})
	})

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
