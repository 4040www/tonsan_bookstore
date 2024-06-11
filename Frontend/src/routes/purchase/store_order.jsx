import React, { useState, useEffect } from 'react';
import './Card_order.css';
import { createPhysicalOrder, Overview, deletePhysicalOrder, editPhysicalOrder } from '../../api';
import store from '../../../public/store.png';

export default function Store_order() {
    const [filter, setFilter] = useState('all');
    const [order, setOrder] = useState(false);
    const [phyData, setPhyData] = useState([]);
    const [addTask, setAddTask] = useState(false);
    const [newTask, setNewTask] = useState({
        job: '',
        deadline: '',
        author: '',
        description: '',
        responsibleName: '',
        status: '未完成'
    });
    const [editingTask, setEditingTask] = useState({
        job: '',
        deadline: '',
        author: '',
        description: '',
        responsibleName: '',
        status: '未完成'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [dataId, setDataId] = useState(0);

    // get data from API ------------------------------------------------------------------

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching data from API...');
                const data = await Overview();
                console.log('Data received from API:', data);
                let filteredData;
                if (filter === 'all') {
                    filteredData = data.filter(item => item.source_table === 'physicalorders').filter(item => item.status !== 1);
                } else {
                    filteredData = data.filter(item => item.source_table === 'physicalorders').filter(item => item.status === filter);
                }
                setPhyData(order ? filteredData.reverse() : filteredData);
            } catch (error) {
                console.error('Error fetching home data:', error);
            }
        };

        fetchData();
    }, [filter, order]);

    // Add new order ------------------------------------------------------------------

    const handleSaveClick = async () => {
        try {
            setAddTask(false);
            setNewTask({
                job: '',
                deadline: '',
                author: '',
                description: '',
                responsibleName: '',
                status: '未完成'
            });
            const response = await createPhysicalOrder(newTask);
            alert('已成功增加待辦事項');
            console.log('Fetching data from API...');
            const data = await Overview();
            console.log('Data received from API:', data);
            let filteredData;
            if (filter === 'all') {
                filteredData = data.filter(item => item.source_table === 'physicalorders').filter(item => item.status !== 1);
            } else {
                filteredData = data.filter(item => item.source_table === 'physicalorders').filter(item => item.status === filter);
            }
            setPhyData(order ? filteredData.reverse() : filteredData);
        } catch (error) {
            console.error('Failed to add order:', error);
            alert('新增待辦事項失敗', error);
        }
    };

    const handleCancelClick = () => {
        setAddTask(false);
        setNewTask({
            job: '',
            deadline: '',
            author: '',
            description: '',
            responsibleName: '',
            status: '未完成',
        });
    };

    // Delete order ------------------------------------------------------------------

    const handleDeleteClick = async (item) => {
        const isConfirmed = window.confirm("確定要刪除此待辦事項嗎？");

        if (!isConfirmed) {
            return;
        }
        try {
            await deletePhysicalOrder(item.id);
            alert('已成功刪除待辦事項');
            const data = await Overview();
            let filteredData;
            if (filter === 'all') {
                filteredData = data.filter(item => item.source_table === 'physicalorders').filter(item => item.status !== 1);
            } else {
                filteredData = data.filter(item => item.source_table === 'physicalorders').filter(item => item.status === filter);
            }
            setPhyData(order ? filteredData.reverse() : filteredData);
        } catch (error) {
            console.error('Failed to delete order:', error);
            alert('刪除待辦事項失敗', error);
        }
    };

    // Edit order ------------------------------------------------------------------

    const handleEditClick = (data) => {
        let statusInEdit;
        if (data.status === 0) {
            statusInEdit = '未完成';
        } else if (data.status === 1) {
            statusInEdit = '已完成';
        } else {
            statusInEdit = '釘選';
        }
        setEditingTask({
            job: data.name,
            deadline: data.due_time.substring(0, 10),
            author: data.registrant,
            description: data.note,
            responsibleName: data.responsible,
            status: statusInEdit
        });
        setIsEditing(true);
        setDataId(data.id);
    };

    const EditCard = ({ task }) => {
        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setEditingTask((prevTask) => ({
                ...prevTask,
                [name]: value
            }));
        };

        const handleInputChangeDate = (e) => {
            const { name, value } = e.target;
            const date = new Date(value);
            date.setDate(date.getDate());
            const newDate = date.toISOString().substring(0, 10);
            setEditingTask((prevTask) => ({
                ...prevTask,
                [name]: newDate
            }));
        };

        const handleCancelClick = () => {
            setIsEditing(false);
        };

        const handleEditSaveClick = async () => {
            try {
                if (
                    editingTask.job === null ||
                    editingTask.deadline === null ||
                    editingTask.author === null ||
                    editingTask.description === null ||
                    editingTask.responsibleName === null ||
                    editingTask.status === null
                ) {
                    alert('有項目為空白，請重新輸入！');
                    return;
                }
                setIsEditing(false);
                setEditingTask({
                    job: '',
                    deadline: '',
                    author: '',
                    description: '',
                    responsibleName: '',
                    status: '未完成'
                });
                console.log('Editing task:', editingTask);
                console.log('Task ID:', dataId);
                const response = await editPhysicalOrder(editingTask, dataId);
                alert('已成功編輯待辦事項');
                console.log('Fetching data from API...');
                const data = await Overview();
                console.log('Data received from API:', data);
                let filteredData;
                if (filter === 'all') {
                    filteredData = data.filter(item => item.source_table === 'physicalorders').filter(item => item.status !== 1);
                } else {
                    filteredData = data.filter(item => item.source_table === 'physicalorders').filter(item => item.status === filter);
                }
                setPhyData(order ? filteredData.reverse() : filteredData);
            } catch (error) {
                console.error('Failed to add order:', error);
                alert('編輯待辦事項失敗', error);
            }
        };

        return (
            <div className="edit-card">
                <h3>編輯工作事項</h3>
                <>
                    <div className="container-add">
                        <p>事項標題 : <input
                            type="text"
                            name="job"
                            value={editingTask.job}
                            defaultValue={editingTask.job}
                            onChange={handleInputChange}
                        /></p>
                        <p>截止日期 : <input
                            type="date"
                            name="deadline"
                            value={editingTask.deadline}
                            onChange={handleInputChangeDate}
                        /></p>
                        <p>填寫人 : <input
                            type="text"
                            name="author"
                            value={editingTask.author}
                            onChange={handleInputChange}
                        /></p>
                        <p>細項說明 : <input
                            type="text"
                            name="description"
                            value={editingTask.description}
                            onChange={handleInputChange}
                        /></p>
                        <p>負責人 : <input
                            type="text"
                            name="responsibleName"
                            value={editingTask.responsibleName}
                            onChange={handleInputChange}
                        /></p>
                        <p>待辦狀態 :
                            <select
                                name="status"
                                value={editingTask.status}
                                className="status-select"
                                onChange={handleInputChange}>
                                <option value="未完成">未完成</option>
                                <option value="已完成">已完成</option>
                                <option value="釘選">釘選</option>
                            </select>
                        </p>
                        <div className="button-group">
                            <button className="save-btn" onClick={handleEditSaveClick}>Save</button>
                            <button className="cancel-btn" onClick={handleCancelClick}>Cancel</button>
                        </div>
                    </div>
                </>
            </div>
        );
    };


    // Filter and UI ------------------------------------------------------------------

    const handleOrderChange = (OrderSelection) => {
        setOrder(OrderSelection);
    };

    const handleFilterChange = (filterType) => {
        setFilter(filterType);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask((prevTask) => ({
            ...prevTask,
            [name]: value
        }));
    };

    const handleInputChangeDate = (e) => {
        const { name, value } = e.target;
        const date = new Date(value);
        date.setDate(date.getDate() + 1);
        const newDate = date.toISOString().substring(0, 10);
        setNewTask((prevTask) => ({
            ...prevTask,
            [name]: newDate
        }));
    };

    const getOrderButtonClass = (OrderSelection) => {
        return order === OrderSelection ? 'cardButton active' : 'cardButton';
    };

    const getButtonClass = (filterType) => {
        return filter === filterType ? 'cardButton active' : 'cardButton';
    };

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

    return (
        <>
            <div className="title-container">
                <img src={store} className="icon-in-page" />
                <h1>實體訂單</h1>
            </div>
            <div className="flex-deliver">

                {isEditing && (
                    <div className="overlay">
                        <EditCard task={editingTask} />
                    </div>
                )}
                <div className="button_block">
                    <div className='flex'>
                        <button className='cardButton' onClick={() => setAddTask(true)}>Add</button>
                    </div>
                    <div className='flex'>
                        <button className={getOrderButtonClass(false)} onClick={() => handleOrderChange(false)}>由新至舊</button>
                        <button className={getOrderButtonClass(true)} onClick={() => handleOrderChange(true)}>由舊至新</button>
                    </div>
                    <div className='flex'>
                        <button className={getButtonClass('all')} onClick={() => handleFilterChange('all')}>顯示全部</button>
                        <button className={getButtonClass(2)} onClick={() => handleFilterChange(2)}>釘選</button>
                        <button className={getButtonClass(0)} onClick={() => handleFilterChange(0)}>未完成</button>
                        <button className={getButtonClass(1)} onClick={() => handleFilterChange(1)}>已完成</button>
                    </div>

                    {addTask && (
                        <>
                            <div className="container-add">
                                <h4>新增工作</h4>
                                <p>事項標題 : <input
                                    type="text"
                                    name="job"
                                    value={newTask.job}
                                    onChange={handleInputChange}
                                /></p>
                                <p>截止日期 : <input
                                    type="date"
                                    name="deadline"
                                    value={newTask.deadline}
                                    onChange={handleInputChangeDate}
                                /></p>
                                <p>填寫人 : <input
                                    type="text"
                                    name="author"
                                    value={newTask.author}
                                    onChange={handleInputChange}
                                /></p>
                                <p>負責人 : <input
                                    type="text"
                                    name="responsibleName"
                                    value={newTask.responsibleName}
                                    onChange={handleInputChange}
                                /></p>
                                <p>待辦狀態 :
                                    <select
                                        name="status"
                                        value={newTask.status}
                                        className="status-select"
                                        onChange={handleInputChange}>
                                        <option value="已完成">已完成</option>
                                        <option value="未完成">未完成</option>
                                        <option value="釘選">釘選</option>
                                    </select>
                                </p>
                                <p>說明<textarea
                                    className='description-textarea'
                                    type="text"
                                    name="description"
                                    value={newTask.description}
                                    onChange={handleInputChange}
                                /></p>
                                <div className="button-group">
                                    <button className="save-btn" onClick={handleSaveClick}>Save</button>
                                    <button className="cancel-btn" onClick={handleCancelClick}>Cancel</button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className='padding-deliver'>
                    {phyData.map((item, index) => (
                        <div className="cardi" key={index}>
                            <div className="statusBar" style={{ backgroundColor: setStatusColor(item.status) }}></div>
                            <div className="margins">
                                <h3>{item.name}</h3>
                                <div className='name-text'>
                                    <p>登記者 : {item.registrant}</p>
                                    <p>負責人 : {item.responsible}</p>
                                </div>
                                <p>截止日期 : {(item.due_time).substring(0, 10)}</p>
                                <p>細項說明 : {item.note}</p>
                                <div className="button-group">
                                    <button className="edit-btn" onClick={() => handleEditClick(item)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDeleteClick(item)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
