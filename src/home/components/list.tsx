import { PageResult, PageData, getDownloadUrl, downloadMagnet } from '../../http/http.service';
import { message } from 'antd';
import copy from 'copy-to-clipboard';
import React from 'react';
import { CopyOutlined, DownloadOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const getUrl = (link: string): Promise<string> => {
    const loading = message.loading('正在获取下载链接');
    return getDownloadUrl(link).then(re => {
        loading();
        return re;
    });
};

const ListItem = (prop: {
    key: string;
    data: PageData;
}) => {
    const {title, description, img, moreLink, type} = prop.data;
    const aira2Url = localStorage.getItem('aira2Url') || '';

    const copyUrl = () => {
        getUrl(moreLink).then(downUrl => {
            if (copy(downUrl)) {
                message.success('下载链接已复制到剪切板');
              } else {
                message.error('获取下载链接失败');
            }
        });
    };

    const download = () => {
        getUrl(moreLink).then(downUrl => {
            if (downUrl) {
                downloadMagnet(aira2Url, downUrl).then(() => {
                    message.success('已成功提交到下载');
                })
            } else {
                message.error('获取下载链接失败');
            }
        });
    }

    return <ListContent>
        <ListItemContent>
            <ListTitle onClick = {() => {window.open(moreLink); }}>{title.trim()}</ListTitle>
            <ListDescription>{description.trim() ? description : '无'}</ListDescription>
            <ListActions>
                {
                    type.map(item => <div key={item} className='type'>{item}</div>)
                }
                <div onClick={copyUrl}><CopyOutlined />拷贝</div>
                { aira2Url ? <div onClick={download}><DownloadOutlined />下载</div> : null}
            </ListActions>
        </ListItemContent>
        <ListImageContent >
            <ListImg alt="" className='list-image' src = {img}></ListImg>
        </ListImageContent>
    </ListContent>;
};

export const List = (prop: PropStyle) => {
    const { list } = prop;

    const renderDataList = () => {
        if (!list) {
            return   <div></div>;
        }
        return list.data.filter(item => item.title).map(item => <ListItem data = {item} key = {item.title}/>);
    };
    return <div>
        {renderDataList()}
    </div>;
};

interface PropStyle {
    list?: PageResult;
}

const ListContent = styled.div`
    height: 160px;
    padding: 15px;
    display: flex;
    border-bottom: 1px solid #e8e8e8;

    @media screen and (max-width:500px){
        height: auto !important;
        padding: 15px;
        display: flex;
        border-bottom: 1px solid #e8e8e8;
        flex-direction: column-reverse;
    }
`

const ListItemContent = styled.div`
    flex: 1;
`

const ListTitle = styled.div`
    color: rgba(0,0,0,0.65);
    font-size: 16px;
    transition: all .3s;
    cursor: pointer;
    ::hover {
        color: #1890ff;
    }
`

const ListDescription = styled.div`
    color: rgba(0,0,0,0.45);
    font-size: 14px;
    line-height: 22px;
    height: 90px;
    margin-top: 5px;
    overflow: hidden;
`

const ListActions = styled.div`
    display: flex;
    div{
        color: rgba(0,0,0,0.45);
        font-size: 14px;
        line-height: 22px;
        text-align: center;
        cursor: pointer;
        margin-right: 5px;
        &:hover {
            color: #1890ff;
        }
    }
` 

const ListImageContent = styled.div`
    width: 220px;
    display: flex;
    justify-content: center;

    @media screen and (max-width:500px){
        width: 100% !important;
        display: flex;
        justify-content: center;
    }
`

const ListImg = styled.img`
    width: 229px;
    height: auto;

    @media screen and (max-width:500px){
        height: 100% !important;
        width: 100% !important;
    }
`