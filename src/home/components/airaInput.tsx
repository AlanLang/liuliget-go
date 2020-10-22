import React from 'react';
import { Input } from 'antd';
import styled from 'styled-components';

export const AiraInput = (props: InputProps) => {
    const { url } = props;
    return <div>
        <Line>
            <Label style={{width: 50}}>地址：</Label>
            <Input defaultValue={url}/>
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
`