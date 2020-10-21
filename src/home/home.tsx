import React, { useState, useEffect } from 'react';
import { Title } from './components/title';
import { Filter } from './components/filter';
import { getLiuliList, SearchType, PageResult } from '../http/http.service';
import { List } from './components/list';
import { Pagination } from 'antd';
import styled from 'styled-components';

export const Home = () => {
    const [list, setList] = useState<PageResult>();
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);

    useEffect(() => {
        getLiuliList(page, filter as SearchType).then(re => {
            setList(re);
        });
    }, [filter, page]);

    const onFilterChange = (value: string) => {
        setFilter(value);
    };

    const onPageChange = (newPage: number) => {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        setPage(newPage);
    };

    return <div>
        <Title />
        <Filter onChange = {onFilterChange}></Filter>
        <List list = {list}></List>
        {list ? <PageChane><Pagination onChange={onPageChange} defaultCurrent={page} total={list.total} showSizeChanger={false} /></PageChane> : null }
    </div>
}

const PageChane = styled.div`
    margin: 15px;
    text-align: center;
`