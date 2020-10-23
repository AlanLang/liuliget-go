import React from 'react';
import { Input } from 'antd';
import styled from 'styled-components';

export const AiraInput = (props: InputProps) => {
    const { url, port, path } = props;
    return <div>
        <Line>
            <Label style={{width: 60, borderRight: 'none'}}>地址:</Label>
            <Input defaultValue={url}/>
            <Label style={{width: 20, borderRight: 'none', borderLeft: 'none'}}>:</Label>
            <Input style={{width: 75}} defaultValue={port}/>
            <Label style={{width: 20, borderRight: 'none', borderLeft: 'none'}}>/</Label>
            <Input style={{width: 95}} defaultValue={path}/>
        </Line>
    </div>
};

export interface InputProps {
    type: string;
    url: string;
    port: string;
    path: string;
    token: string;
}

const Line = styled.div`
    display: flex;
    align-items: center;
`
const Label = styled.div`
    background-color: #eee;
    height: 32px;
    text-align: center;
    line-height: 32px;
    border: 1px solid #d9d9d9;
    overflow: hidden;
`