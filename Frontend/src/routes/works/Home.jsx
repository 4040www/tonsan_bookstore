import React, { useState, useEffect } from 'react';
import { Overview } from '../../api';
import timer from '../../../public/time.png';

export default function Home() {
  const [homeData, setHomeData] = useState([]);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Set the current date
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        const formattedDate = today.toLocaleDateString('zh-CN', options);
        setCurrentDate(formattedDate);

        console.log('Fetching data from API...');
        const data = await Overview();
        console.log('Data received from API:', data);

        // 過濾出截止日期與當前日期相同的項目
        const filteredData = data.filter(item => {
          const itemDueDate = new Date(item.due_time);
          const itemDate = new Date(itemDueDate.getFullYear(), itemDueDate.getMonth(), itemDueDate.getDate());
          const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
          return itemDate.getTime() === todayDate.getTime();
        });

        console.log('Filtered data:', filteredData);
        setHomeData(filteredData);
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    };

    fetchData();
  }, []);


  const setStatusColor = (status) => {
    switch (status) {
      case 0:
        return 'green';
      case 2:
        return 'red';
      case 1:
        return 'gray';
      default:
        return 'transparent';
    }
  };

  const getName = (type) => {
    switch (type) {
      case 'eventsTodo':
        return '活動待辦';
      case 'onlineorders':
        return '網路訂單';
      case 'physicalorders':
        return '實體訂單';
      case 'restockandrefund':
        return '進退貨';
      case 'sinica':
        return '四分溪';
      default:
        return 'None';
    }
  };

  return (
    <div id="home" >
      <div className='title-container'>
        <img src={timer} className="icon-in-page" />
        <h1>今日工作</h1>
      </div>
      <h3>今天的日期：<span id="current-date">{currentDate}</span></h3>
      <div className="card-container">
        <div id="home" style={{ display: 'flex', flexWrap: 'wrap' }}>
          {homeData.map((item, index) => (
            <div className="cardi" key={index} style={{ width: '30%', margin: '1.5%' }}>
              <div className="statusBar" style={{ backgroundColor: setStatusColor(item.status) }}></div>
              <div className="margins">
                <h3>{item.name}</h3>
                <p>事項種類 : {getName(item.source_table)}</p>
                <div className='name-text'>
                  <p>登記者 : {item.registrant}</p>
                  <p>負責人 : {item.responsible}</p>
                </div>
                <p>截止日期 : {(item.due_time).substring(0, 10)}</p>
                <p>細項說明 : {item.note}</p>
                {/* <div className="button-group">
                  <button className="edit-btn" onClick={() => handleEditClick(item)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDeleteClick(item)}>Delete</button>
                </div> */}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
