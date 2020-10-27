import React from 'react';
import { Input } from 'antd';
import styled from 'styled-components';

export const AiraInput = (props: InputProps) => {
    const { url, type, port, path, token } = props.value;
    const config = Object.assign({}, props.value);

    return <div>
        <Line>
            <Label style={{width: 60, borderRight: 'none'}}>地址:</Label>
            <Input style={{width: 60, flexShrink: 0}} defaultValue={type} onChange={(e) => {
                config.type = e.target.value
                props.onChange(config)
            }}/>
            <Label style={{width: 20, borderRight: 'none', borderLeft: 'none'}}>://</Label>
            <Input defaultValue={url} onChange={(e) => {
                config.url = e.target.value
                props.onChange(config)
            }}/>
            <Label style={{width: 20, borderRight: 'none', borderLeft: 'none'}}>:</Label>
            <Input style={{width: 60, flexShrink: 0}} defaultValue={port} onChange={(e) => {
                config.port = e.target.value
                props.onChange(config)
            }}/>
            <Label style={{width: 20, borderRight: 'none', borderLeft: 'none'}}>/</Label>
            <Input style={{width: 75, flexShrink: 0}} defaultValue={path} onChange={(e) => {
                config.path = e.target.value
                props.onChange(config)
            }}/>
        </Line>
        <Line style={{marginTop: 12}}>
            <Label style={{width: 60, borderRight: 'none'}}>token:</Label>
            <Input defaultValue={token} type="password" onChange={(e) => {
                config.token = e.target.value
                props.onChange(config)
            }}/>
        </Line>
    </div>
};

export interface InputProps {
    value: AiraConfig;
    onChange: (config: AiraConfig) => void;
}

export interface AiraConfig{
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
    flex-shrink: 0;
`