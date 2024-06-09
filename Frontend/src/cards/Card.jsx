import React, { useState } from 'react';
import './listCard.css';

export default function Card({ data }) {
  // 初始化狀態
  const [filter, setFilter] = useState('');
  const [responsibleFilter, setResponsibleFilter] = useState('12345');  // 設定負責人過濾初始值為12345
  const [tasks, setTasks] = useState(data);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleResponsibleChange = (event) => {
    setResponsibleFilter(event.target.value);
  };

  const filteredTasks = tasks.slice().sort((a, b) => {
    if (filter === '由新至舊') {
        return new Date(b.deadline) - new Date(a.deadline);
    } else if (filter === '由舊至新') {
        return new Date(a.deadline) - new Date(b.deadline);
    }
    return 0;
  }).filter(task => {
    if (filter === '釘選' && task.status === '釘選') {
        return true;
    } else if (filter === '已完成' && task.status === '已完成') {
        return true;
    } else if (filter === '未完成' && task.status === '未完成') {
        return true;
    } else if (task.responsible === responsibleFilter) {
        return true;  // 新增過濾條件，負責人名稱匹配
    }
    return filter === ''; // 如果沒有過濾條件，顯示所有任務
  });

  return (
    <div className="wrapcard">
      <div className="filter-container">
        <select onChange={handleFilterChange} value={filter}>
            <option value="">選擇過濾器</option>
            <option value="由新至舊">由新至舊</option>
            <option value="由舊至新">由舊至新</option>
            <option value="釘選">釘選</option>
            <option value="已完成">已完成</option>
            <option value="未完成">未完成</option>
        </select>
        <input type="text" value={responsibleFilter} onChange={handleResponsibleChange} placeholder="輸入負責人名稱" />
      </div>
      {filteredTasks.map((task, index) => (
        <div key={index} className="card">
          <div className="container">
            <h4><b>代辦名稱:{task.name}</b></h4>
            <p>登記者：{task.registrant}</p>
            <p>負責人：{task.responsible}</p>
            <p>備註：{task.note}</p>
            <p>狀態：{task.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
}



/*
import React, { useState } from 'react';
import './Card.css';

export default function CardEmployee() {
    const [title, setTitle] = useState('***工作事項類別***');
    const [tasks, setTasks] = useState([
        { job: 'Job 1', deadline: '到期時間', author: '填寫人', description: '細項說明' }
    ]);

    return (
        <div className="wrapcard">
            <div className="title-container">
                <h2>{title}</h2>
            </div>
            <div>
                &nbsp;&nbsp;
            </div>
            {tasks.map((task, index) => (
                <div className="card" key={index}>
                    <div className="container">
                        <p>任務名稱: {task.name}</p>
                        <p>到期時間: {task.due_time}</p>
                        <p>填寫人: {task.registrant}</p>
                        <p>負責人: {task.responsible}</p>
                        <p>細項說明: {task.note}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
*/