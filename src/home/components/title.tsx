import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Drawer, Button, Row, Col, Input } from 'antd';

export const Title = () => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [aira2Url, setAira2Url] = useState(localStorage.getItem('aira2Url') || '');

    const onClose = () => {
        setDrawerVisible(false)
    }

    const onSave = () => {
        setLoading(true);
        localStorage.setItem("aira2Url", aira2Url);
        setLoading(false);
        onClose();
    }

    useEffect(() => {
        setAira2Url(localStorage.getItem('aira2Url') || '');
    }, []);



    return <div>
        <TitleContent>
            <TitleStyled>欢迎使用琉璃神社</TitleStyled>
            <TitleSet onClick={() => {
                setDrawerVisible(true);
            }}>设置</TitleSet>
        </TitleContent>
        <Drawer 
            title="偏好设置" 
            width={document.body.clientWidth < 500 ? '100%' : '50%'}
            visible={drawerVisible}
            bodyStyle={{ paddingBottom: 80 }}
            maskClosable={true}
            onClose={onClose}
            footer={
                <div
                  style={{
                    textAlign: 'right',
                  }}
                >
                  <Button onClick={onClose} style={{ marginRight: 8 }}>
                    取消
                  </Button>
                  <Button onClick={onSave} type="primary" loading={loading}>
                    保存
                  </Button>
                </div>
            }
        >
            <Row gutter={16}>
                <Col span={24}>
                    <Label>Aira2下载地址</Label>
                    <Input placeholder="请填写Aira2下载地址" defaultValue={aira2Url} onChange={(e) => {
                            setAira2Url(e.target.value)
                    }} />
                </Col>
            </Row>
        </Drawer>
    </div>
}

const TitleStyled = styled.div`
    height: 50px;
    line-height: 50px;
    font-size: 25px;
    padding-left: 15px;
`

const TitleContent = styled.div`
    display: flex;
    background-color: #00adb5;
    justify-content: space-between;
    color: white;
`
const TitleSet = styled.div`
    height: 30px;
    line-height: 50px;
    padding-right: 15px;
    cursor: pointer;
`
const Label = styled.div`
    margin-bottom: 5px;
    padding-left: 2px;
`