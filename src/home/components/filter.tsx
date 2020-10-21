import React from 'react';
import { Radio } from 'antd';
import styled from 'styled-components';

export const Filter = (prop: PropStyle) => {
    const { onChange } = prop;
    return <FilterContent>
        <Radio.Group defaultValue="all" onChange= {
            (e) => {
                onChange(e.target.value);
            }
        }>
            <Radio.Button value="all">全部</Radio.Button>
            <Radio.Button value="anime">动画</Radio.Button>
            <Radio.Button value="comic">漫画</Radio.Button>
            <Radio.Button value="game">游戏</Radio.Button>
            <Radio.Button value="op">音乐</Radio.Button>
        </Radio.Group>
    </FilterContent>
}
interface PropStyle {
    onChange: (value: string) =>  void;
}

const FilterContent = styled.div`
    padding: 15px;
`