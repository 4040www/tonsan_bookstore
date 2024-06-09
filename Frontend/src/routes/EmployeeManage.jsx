import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import { createUser, showusers, deleteUser, editUser } from '../api';

export default function EmployeeManage() {
    const [employees, setEmployees] = useState([]);
    const [newEmployee, setNewEmployee] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editEmployee, setEditEmployee] = useState('');
    const [currentEmployeeId, setCurrentEmployeeId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching data from API...');
                const data = await showusers();
                console.log('Data received from API:', data);
                setEmployees(data);
            } catch (error) {
                console.error('Error fetching home data:', error);
            }
        };

        fetchData();
    }, []);

    const handleAddEmployee = async () => {
        if (newEmployee.trim() !== '') {
            try {
                console.log('Adding employee:', newEmployee);
                const newEmp = await createUser(newEmployee);
                setEmployees([...employees, newEmp]);
                setNewEmployee('');
                setIsAdding(false);
                alert('成功建立帳號！');
            } catch (error) {
                console.error('Failed to add employee:', error);
                alert('新增員工失敗！');
            }
        }
    };

    const handleEditEmployee = async () => {
        const updatedEmployees = employees.map(employee =>
            employee.id === currentEmployeeId ? { ...employee, name: editEmployee } : employee
        );
        let editedName = {employee: editEmployee}
        try {
            console.log('Updated employee:', editedName);
            console.log('Editing employee:', currentEmployeeId);
            await editUser(editedName, currentEmployeeId);
            alert('已成功編輯員工資料');
        } catch (error) {
            console.error('Failed to edit employee:', error);
            alert('編輯員工資料失敗');
        }
        setEmployees(updatedEmployees);
        setIsEditing(false);
        setEditEmployee('');
        setCurrentEmployeeId(null);
    };

    const handleDeleteEmployee = async (id) => {
        try {
            console.log('Deleting employee:', id);
            await deleteUser(id);
            alert('已成功刪除員工');
            console.log('Fetching data from API...');
            const data = await showusers();
            console.log('Data received from API:', data);
            setEmployees(data);
        } catch (error) {
            console.error('Failed to delete order:', error);
            alert('刪除員工失敗', error);
        }
        const updatedEmployees = employees.filter(employee => employee.id !== id);
        setEmployees(updatedEmployees);
    };

    return (
        <div id="notes" className='note'>
            <h1>員工管理系統</h1>
            {isAdding ? (
                <div className="add-employee-form">
                    <input
                        type="text"
                        value={newEmployee}
                        onChange={(e) => setNewEmployee(e.target.value)}
                        placeholder="輸入新員工姓名"
                        autoFocus
                    />
                    <button className="save-btn" onClick={handleAddEmployee}>儲存</button>
                    <button className="save-btn" onClick={() => setIsAdding(false)}>取消</button>
                </div>
            ) : (
                <div>
                    <button className="edit-btn" onClick={() => setIsAdding(true)}>新增員工</button>
                </div>
            )}
            <div className='employee-table'>
                {employees.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>姓名</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) => (
                                <tr key={employee.id}>
                                    <td>{isEditing && currentEmployeeId === employee.id ? (
                                        <input
                                            type="text"
                                            value={editEmployee}
                                            onChange={(e) => setEditEmployee(e.target.value)}
                                            placeholder="編輯員工姓名"
                                            autoFocus
                                        />
                                    ) : (
                                        employee.name
                                    )}</td>
                                    <td>
                                        {isEditing && currentEmployeeId === employee.id ? (
                                            <>
                                                <button className="save-btn" onClick={handleEditEmployee}>儲存</button>
                                                <button className="save-btn" onClick={() => setIsEditing(false)}>取消</button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="edit-btn" onClick={() => {
                                                    setIsEditing(true);
                                                    setEditEmployee(employee.name);
                                                    setCurrentEmployeeId(employee.id);
                                                }}>編輯</button>
                                                <button className="edit-btn" onClick={() => handleDeleteEmployee(employee.id)}>刪除</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <div style={{ display: 'flex' }}>
                <nav>
                    <Link to={`/Note`}><button className="edit-btn">回上頁</button></Link>
                </nav>
            </div>
        </div>
    );
}
