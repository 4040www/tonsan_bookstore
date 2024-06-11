import React, { useState, useEffect } from 'react';
import AllCard from "./AllCard";
import { Overview } from '../../../api';
import overview from '/overview.png';

export default function Works() {

  const [homeData, setHomeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from API...');
        const data = await Overview();
        console.log('Data received from API:', data);
        setHomeData(data.filter(item => item.status != 1));
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    };

    fetchData();
  }, []);



  const filterDataByType = (type) => {
    return homeData.filter(item => item.source_table === type);
  };

  return (
    <div id="works" >
      <div className='title-container'>
        <img src={overview} className="icon-in-page" />
        <h1>工作總覽</h1>
      </div>
      <h3>依照工作類別分類</h3>
      <div className="">
        {homeData.length === 0 ? (
          <p style={{fontSize: '20px' }}>Loading...</p>
        ) : (
          <div className='flex-card'>
            <AllCard type={'restockandrefund'} data={filterDataByType('restockandrefund')} />
            <AllCard type={'onlineorders'} data={filterDataByType('onlineorders')} />
            <AllCard type={'physicalorders'} data={filterDataByType('physicalorders')} />
            <AllCard type={'sinica'} data={filterDataByType('sinica')} />
            <AllCard type={'eventsTodo'} data={filterDataByType('eventsTodo')} />
          </div>
        )}
      </div>
    </div>
  );
}