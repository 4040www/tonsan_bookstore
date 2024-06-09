const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 設置 PostgreSQL 連接
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// 測試 PostgreSQL 連接
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err.stack);
    } else {
        console.log('Connected to PostgreSQL');
        release();
    }
});

app.use(cors());
app.use(express.json());


// 所有頁面的資料皆是從這裡拿 ----------------------------------------------------

app.get('/Works', (req, res) => {
    let baseQuery = `
        SELECT 
            t.id, 
            t.name, 
            t.note, 
            u1.name AS registrant, 
            u2.name AS responsible,
            t.status,
            t.due_time, 
            'eventsTodo' AS source_table
        FROM eventsTodo t
        LEFT JOIN users u1 ON t.registrant = u1.id
        LEFT JOIN users u2 ON t.responsible = u2.id
        
        UNION

        SELECT
            o.id,
            o.name,
            o.note,
            u1.name AS registrant,
            u2.name AS responsible,
            o.status,
            o.due_time, 
            'onlineorders' AS source_table
        FROM onlineorders o
        LEFT JOIN users u1 ON o.registrant = u1.id
        LEFT JOIN users u2 ON o.responsible = u2.id

        UNION

        SELECT
            p.id,
            p.name,
            p.note,
            u1.name AS registrant,
            u2.name AS responsible,
            p.status,
            p.due_time,
            'physicalorders' AS source_table
        FROM physicalorders p
        LEFT JOIN users u1 ON p.registrant = u1.id
        LEFT JOIN users u2 ON p.responsible = u2.id

        UNION

        SELECT
            r.id,
            r.name,
            r.note,
            u1.name AS registrant,
            u2.name AS responsible,
            r.status,
            r.due_time,
            'restockandrefund' AS source_table
        FROM restockandrefund r
        LEFT JOIN users u1 ON r.registrant = u1.id
        LEFT JOIN users u2 ON r.responsible = u2.id

        UNION

        SELECT
            s.id,
            s.name,
            s.note,
            u1.name AS registrant,
            u2.name AS responsible,
            s.status,
            s.due_time,
            'sinica' AS source_table
        FROM sinica s
        LEFT JOIN users u1 ON s.registrant = u1.id
        LEFT JOIN users u2 ON s.responsible = u2.id

        ORDER BY due_time
    `;

    pool.query(baseQuery, (err, results) => {
        if (err) {
            console.log('Error executing query:', err);
            return res.status(500).send(err);
        } else {
            console.log('Query executed successfully. Rows:', results.rows);
            res.json(results.rows);
        }
    });
});


// 新增資料串 ----------------------------------------------------

app.post('/Online-orders', (req, res) => {
    const { job, deadline, author, description, responsibleName, status } = req.body;

    console.log('Received order:', req.body);

    const statusMapping = {
        '未完成': 0,
        '已完成': 1,
        '釘選': 2
    };

    const statusInt = statusMapping[status];
    if (statusInt === undefined) {
        return res.status(400).send('Invalid status');
    }

    const registrantQuery = 'SELECT id FROM users WHERE name = $1';
    const responsibleQuery = 'SELECT id FROM users WHERE name = $1';

    const adjustedDeadline = new Date(deadline);
    adjustedDeadline.setDate(adjustedDeadline.getDate() + 1);
    const formattedDeadline = adjustedDeadline.toISOString().substring(0, 10);

    pool.query(registrantQuery, [author], (err, registrantResult) => {
        if (err) {
            console.error('Error querying registrant:', err);
            return res.status(500).send(err);
        }
        console.log('Registrant query result:', registrantResult.rows);

        if (registrantResult.rows.length === 0) {
            console.error('Author not found');
            return res.status(404).send('Author not found');
        }

        const registrantId = registrantResult.rows[0].id;
        console.log('Registrant ID:', registrantId);

        pool.query(responsibleQuery, [responsibleName], (err, responsibleResult) => {
            if (err) {
                console.error('Error querying responsible:', err);
                return res.status(500).send(err);
            }
            console.log('Responsible query result:', responsibleResult.rows);

            if (responsibleResult.rows.length === 0) {
                console.error('Responsible person not found');
                return res.status(404).send('Responsible person not found');
            }

            const responsibleId = responsibleResult.rows[0].id;
            console.log('Responsible ID:', responsibleId);

            const insertQuery = 'INSERT INTO onlineorders (name, due_time, registrant, note, responsible, status) VALUES ($1, $2, $3, $4, $5, $6)';
            pool.query(insertQuery, [job, formattedDeadline, registrantId, description, responsibleId, statusInt], (err, result) => {
                if (err) {
                    console.error('Error inserting order:', err);
                    return res.status(500).send(err);
                }
                console.log('Insert result:', result);
                res.status(201).json({ message: '已成功增加待辦' });

            });
        });
    });
});

app.post('/Physical-orders', (req, res) => {
    const { job, deadline, author, description, responsibleName, status } = req.body;

    console.log('Received order:', req.body);

    const statusMapping = {
        '未完成': 0,
        '已完成': 1,
        '釘選': 2
    };

    const statusInt = statusMapping[status];
    if (statusInt === undefined) {
        return res.status(400).send('Invalid status');
    }

    const registrantQuery = 'SELECT id FROM users WHERE name = $1';
    const responsibleQuery = 'SELECT id FROM users WHERE name = $1';

    const adjustedDeadline = new Date(deadline);
    adjustedDeadline.setDate(adjustedDeadline.getDate() + 1);
    const formattedDeadline = adjustedDeadline.toISOString().substring(0, 10);

    pool.query(registrantQuery, [author], (err, registrantResult) => {
        if (err) {
            console.error('Error querying registrant:', err);
            return res.status(500).send(err);
        }
        console.log('Registrant query result:', registrantResult.rows);

        if (registrantResult.rows.length === 0) {
            console.error('Author not found');
            return res.status(404).send('Author not found');
        }

        const registrantId = registrantResult.rows[0].id;
        console.log('Registrant ID:', registrantId);

        pool.query(responsibleQuery, [responsibleName], (err, responsibleResult) => {
            if (err) {
                console.error('Error querying responsible:', err);
                return res.status(500).send(err);
            }
            console.log('Responsible query result:', responsibleResult.rows);

            if (responsibleResult.rows.length === 0) {
                console.error('Responsible person not found');
                return res.status(404).send('Responsible person not found');
            }

            const responsibleId = responsibleResult.rows[0].id;
            console.log('Responsible ID:', responsibleId);

            const insertQuery = 'INSERT INTO physicalorders (name, due_time, registrant, note, responsible, status) VALUES ($1, $2, $3, $4, $5, $6)';
            pool.query(insertQuery, [job, formattedDeadline, registrantId, description, responsibleId, statusInt], (err, result) => {
                if (err) {
                    console.error('Error inserting order:', err);
                    return res.status(500).send(err);
                }
                console.log('Insert result:', result);
                res.status(201).json({ message: '已成功增加待辦' });
            });
        });
    });
});

app.post('/Sinica', (req, res) => {
    const { job, deadline, author, description, responsibleName, status } = req.body;

    console.log('Received order:', req.body);

    const statusMapping = {
        '未完成': 0,
        '已完成': 1,
        '釘選': 2
    };

    const statusInt = statusMapping[status];
    if (statusInt === undefined) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    const registrantQuery = 'SELECT id FROM users WHERE name = $1';
    const responsibleQuery = 'SELECT id FROM users WHERE name = $1';

    const adjustedDeadline = new Date(deadline);
    adjustedDeadline.setDate(adjustedDeadline.getDate() + 1);
    const formattedDeadline = adjustedDeadline.toISOString().substring(0, 10);

    pool.query(registrantQuery, [author], (err, registrantResult) => {
        if (err) {
            console.error('Error querying registrant:', err);
            return res.status(500).json({ error: 'Error querying registrant', details: err });
        }
        console.log('Registrant query result:', registrantResult.rows);

        if (registrantResult.rows.length === 0) {
            console.error('Author not found');
            return res.status(404).json({ error: 'Author not found' });
        }

        const registrantId = registrantResult.rows[0].id;
        console.log('Registrant ID:', registrantId);

        pool.query(responsibleQuery, [responsibleName], (err, responsibleResult) => {
            if (err) {
                console.error('Error querying responsible:', err);
                return res.status(500).json({ error: 'Error querying responsible', details: err });
            }
            console.log('Responsible query result:', responsibleResult.rows);

            if (responsibleResult.rows.length === 0) {
                console.error('Responsible person not found');
                return res.status(404).json({ error: 'Responsible person not found' });
            }

            const responsibleId = responsibleResult.rows[0].id;
            console.log('Responsible ID:', responsibleId);

            const insertQuery = 'INSERT INTO sinica (name, due_time, registrant, note, responsible, status) VALUES ($1, $2, $3, $4, $5, $6)';
            pool.query(insertQuery, [job, formattedDeadline, registrantId, description, responsibleId, statusInt], (err, result) => {
                if (err) {
                    console.error('Error inserting order:', err);
                    return res.status(500).json({ error: 'Error inserting order', details: err });
                }
                console.log('Insert result:', result);
                res.status(201).json({ message: '已成功增加待辦' });
            });
        });
    });
});

app.post('/Restock-and-Refund', (req, res) => {
    // 好像只有這裡是 responsibleName
    const { job, deadline, author, description, responsibleName, status } = req.body;

    console.log('Received order:', req.body);

    const statusMapping = {
        '未完成': 0,
        '已完成': 1,
        '釘選': 2
    };

    const statusInt = statusMapping[status];
    if (statusInt === undefined) {
        return res.status(400).send('Invalid status');
    }

    const registrantQuery = 'SELECT id FROM users WHERE name = $1';
    const responsibleQuery = 'SELECT id FROM users WHERE name = $1';

    const adjustedDeadline = new Date(deadline);
    adjustedDeadline.setDate(adjustedDeadline.getDate() + 1);
    const formattedDeadline = adjustedDeadline.toISOString().substring(0, 10);

    pool.query(registrantQuery, [author], (err, registrantResult) => {
        if (err) {
            console.error('Error querying registrant:', err);
            return res.status(500).send(err);
        }
        console.log('Registrant query result:', registrantResult.rows);

        if (registrantResult.rows.length === 0) {
            console.error('Author not found');
            return res.status(404).send('Author not found');
        }

        const registrantId = registrantResult.rows[0].id;
        console.log('Registrant ID:', registrantId);
        console.log(author, responsibleName);

        if (author === responsibleName) {
            const responsibleId = registrantId;
            console.log('Author and responsible are the same person. Using registrantId for both.');

            const insertQuery = 'INSERT INTO restockandrefund (name, due_time, registrant, note, responsible, status) VALUES ($1, $2, $3, $4, $5, $6)';
            pool.query(insertQuery, [job, formattedDeadline, registrantId, description, responsibleId, statusInt], (err, result) => {
                if (err) {
                    console.error('Error inserting order:', err);
                    return res.status(500).send(err);
                }
                console.log('Insert result:', result);
                res.status(201).json({ message: '已成功增加待辦' });
            });
        } else {
            pool.query(responsibleQuery, [responsibleName], (err, responsibleResult) => {
                if (err) {
                    console.error('Error querying responsible:', err);
                    return res.status(500).send(err);
                }
                console.log('Responsible query result:', responsibleResult.rows);

                if (responsibleResult.rows.length === 0) {
                    console.error('Responsible person not found');
                    return res.status(404).send('Responsible person not found');
                }

                const responsibleId = responsibleResult.rows[0].id;
                console.log('Responsible ID:', responsibleId);

                const insertQuery = 'INSERT INTO restockandrefund (name, due_time, registrant, note, responsible, status) VALUES ($1, $2, $3, $4, $5, $6)';
                pool.query(insertQuery, [job, deadline, registrantId, description, responsibleId, statusInt], (err, result) => {
                    if (err) {
                        console.error('Error inserting order:', err);
                        return res.status(500).send(err);
                    }
                    console.log('Insert result:', result);
                    res.status(201).json({ message: '已成功增加待辦' });
                });
            });
        }
    });
});

app.post('/Events-todo', (req, res) => {
    const { job, deadline, author, description, responsibleName, status } = req.body;

    console.log('Received order:', req.body);

    const statusMapping = {
        '未完成': 0,
        '已完成': 1,
        '釘選': 2
    };

    const statusInt = statusMapping[status];
    if (statusInt === undefined) {
        return res.status(400).send('Invalid status');
    }

    const registrantQuery = 'SELECT id FROM users WHERE name = $1';
    const responsibleQuery = 'SELECT id FROM users WHERE name = $1';

    const adjustedDeadline = new Date(deadline);
    adjustedDeadline.setDate(adjustedDeadline.getDate() + 1);
    const formattedDeadline = adjustedDeadline.toISOString().substring(0, 10);

    pool.query(registrantQuery, [author], (err, registrantResult) => {
        if (err) {
            console.error('Error querying registrant:', err);
            return res.status(500).send(err);
        }
        console.log('Registrant query result:', registrantResult.rows);

        if (registrantResult.rows.length === 0) {
            console.error('Author not found');
            return res.status(404).send('Author not found');
        }

        const registrantId = registrantResult.rows[0].id;
        console.log('Registrant ID:', registrantId);

        pool.query(responsibleQuery, [responsibleName], (err, responsibleResult) => {
            if (err) {
                console.error('Error querying responsible:', err);
                return res.status(500).send(err);
            }
            console.log('Responsible query result:', responsibleResult.rows);

            if (responsibleResult.rows.length === 0) {
                console.error('Responsible person not found');
                return res.status(404).send('Responsible person not found');
            }

            const responsibleId = responsibleResult.rows[0].id;
            console.log('Responsible ID:', responsibleId);

            const insertQuery = 'INSERT INTO eventstodo (name, due_time, registrant, note, responsible, status) VALUES ($1, $2, $3, $4, $5, $6)';
            pool.query(insertQuery, [job, formattedDeadline, registrantId, description, responsibleId, statusInt], (err, result) => {
                if (err) {
                    console.error('Error inserting order:', err);
                    return res.status(500).send(err);
                }
                console.log('Insert result:', result);
                res.status(201).json({ message: '已成功增加待辦' });
            });
        });
    });
});

// 員工相關資料 ----------------------------------------------------

app.post('/Users', (req, res) => {
    const { username } = req.body;
    const newUser = { name: username };
    pool.query('INSERT INTO users (name) VALUES ($1) RETURNING *', [newUser.name], (error, results) => {
        if (error) {
            console.error('Error inserting user:', error); // 輸出錯誤到後端控制台
            res.status(500).send(error); // 返回 500 狀態碼和錯誤信息
        } else {
            const insertedUser = results.rows[0]; // 從結果中獲取插入的用戶
            res.status(201).json(insertedUser); // 返回 201 狀態碼和新用戶的 JSON 對象
        }
    });
});

app.delete('/Users/:id', (req, res) => {
    const orderId = req.params.id;

    const deleteQuery = 'DELETE FROM users WHERE id = $1';
    console.log('deleteQuery:', deleteQuery);
    console.log('orderId:', orderId);
    pool.query(deleteQuery, [orderId], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.rowCount === 0) {
            return res.status(404).send('User not found');
        }
        res.status(200).send('已成功刪除員工');
    });
});

app.put('/Users/:id', (req, res) => {
    const { employee } = req.body;
    const employeeId = req.params.id;

    console.log('Received order:', req.body);
    console.log('employee:', employee);
    console.log('employeeId:', employeeId);

    const employeeQuery = 'SELECT id FROM users WHERE id = $1';

    pool.query(employeeQuery, [employeeId], (err, orderResult) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (orderResult.rows.length === 0) {
            return res.status(404).send('Order not found');
        }

        console.log('orderResult:', orderResult);

        const updateQuery = 'UPDATE users SET name = $1 WHERE id = $2';
        pool.query(updateQuery, [employee, employeeId], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).send('已成功員工名稱');
        });
    });
});



// 編輯資料串 ----------------------------------------------------

app.put('/Restock-and-Refund/:id', (req, res) => {
    const { job, deadline, author, description, responsibleName, status } = req.body;

    const statusMapping = {
        '未完成': 0,
        '已完成': 1,
        '釘選': 2
    };

    const orderId = req.params.id;

    // const statusInt = status;
    const statusInt = statusMapping[status];
    if (statusInt === undefined) {
        return res.status(400).send('Invalid status');
    }

    if (deadline === null) {
        return res.status(400).send('Invalid deadline');
    }

    const registrantQuery = `SELECT id FROM users WHERE name = $1`;
    const responsibleQuery = 'SELECT id FROM users WHERE name = $1';
    const orderQuery = 'SELECT * FROM restockandrefund WHERE id = $1';

    const adjustedDeadline = new Date(deadline);
    adjustedDeadline.setDate(adjustedDeadline.getDate() + 1);
    const formattedDeadline = adjustedDeadline.toISOString().substring(0, 10);

    pool.query(orderQuery, [orderId], (err, orderResult) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (orderResult.rows.length === 0) {
            return res.status(404).send('Order not found');
        }

        pool.query(registrantQuery, [author], (err, registrantResult) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (registrantResult.rows.length === 0) {
                return res.status(404).send('Author not found');
            }

            const registrantId = registrantResult.rows[0].id;

            pool.query(responsibleQuery, [responsibleName], (err, responsibleResult) => {
                if (err) {
                    return res.status(500).send(err);
                }

                if (responsibleResult.rows.length === 0) {
                    return res.status(404).send('Responsible person not found');
                }

                const responsibleId = responsibleResult.rows[0].id;

                const updateQuery = 'UPDATE restockandrefund SET name = $1, due_time = $2, registrant = $3, note = $4, responsible = $5, status = $6 WHERE id = $7';
                pool.query(updateQuery, [job, formattedDeadline, registrantId, description, responsibleId, statusInt, orderId], (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.status(200).send('已成功更新待辦');
                });
            });
        });
    });
});

app.put('/Online-orders/:id', (req, res) => {
    const { job, deadline, author, description, responsibleName, status } = req.body;

    const statusMapping = {
        '未完成': 0,
        '已完成': 1,
        '釘選': 2
    };

    const orderId = req.params.id;

    // const statusInt = status;
    const statusInt = statusMapping[status];

    if (statusInt === undefined) {
        return res.status(400).send('Invalid status');
    }

    if (deadline === null) {
        return res.status(400).send('Invalid deadline');
    }

    const registrantQuery = `SELECT id FROM users WHERE name = $1`;
    const responsibleQuery = 'SELECT id FROM users WHERE name = $1';
    const orderQuery = 'SELECT * FROM onlineorders WHERE id = $1';

    const adjustedDeadline = new Date(deadline);
    adjustedDeadline.setDate(adjustedDeadline.getDate() + 1);
    const formattedDeadline = adjustedDeadline.toISOString().substring(0, 10);

    pool.query(orderQuery, [orderId], (err, orderResult) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (orderResult.rows.length === 0) {
            return res.status(404).send('Order not found');
        }

        pool.query(registrantQuery, [author], (err, registrantResult) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (registrantResult.rows.length === 0) {
                return res.status(404).send('Author not found');
            }

            const registrantId = registrantResult.rows[0].id;

            pool.query(responsibleQuery, [responsibleName], (err, responsibleResult) => {
                if (err) {
                    return res.status(500).send(err);
                }

                if (responsibleResult.rows.length === 0) {
                    return res.status(404).send('Responsible person not found');
                }

                const responsibleId = responsibleResult.rows[0].id;

                const updateQuery = 'UPDATE onlineorders SET name = $1, due_time = $2, registrant = $3, note = $4, responsible = $5, status = $6 WHERE id = $7';
                pool.query(updateQuery, [job, formattedDeadline, registrantId, description, responsibleId, statusInt, orderId], (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.status(200).send('已成功更新待辦');
                });
            });
        });
    });
});

app.put('/Physical-orders/:id', (req, res) => {
    const { job, deadline, author, description, responsibleName, status } = req.body;

    const statusMapping = {
        '未完成': 0,
        '已完成': 1,
        '釘選': 2
    };

    const orderId = req.params.id;

    // const statusInt = status;
    const statusInt = statusMapping[status];

    if (statusInt === undefined) {
        return res.status(400).send('Invalid status');
    }

    if (deadline === null) {
        return res.status(400).send('Invalid deadline');
    }

    const registrantQuery = `SELECT id FROM users WHERE name = $1`;
    const responsibleQuery = 'SELECT id FROM users WHERE name = $1';
    const orderQuery = 'SELECT * FROM physicalorders WHERE id = $1';

    const adjustedDeadline = new Date(deadline);
    adjustedDeadline.setDate(adjustedDeadline.getDate() + 1);
    const formattedDeadline = adjustedDeadline.toISOString().substring(0, 10);

    pool.query(orderQuery, [orderId], (err, orderResult) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (orderResult.rows.length === 0) {
            return res.status(404).send('Order not found');
        }

        pool.query(registrantQuery, [author], (err, registrantResult) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (registrantResult.rows.length === 0) {
                return res.status(404).send('Author not found');
            }

            const registrantId = registrantResult.rows[0].id;

            pool.query(responsibleQuery, [responsibleName], (err, responsibleResult) => {
                if (err) {
                    return res.status(500).send(err);
                }

                if (responsibleResult.rows.length === 0) {
                    return res.status(404).send('Responsible person not found');
                }

                const responsibleId = responsibleResult.rows[0].id;

                const updateQuery = 'UPDATE physicalorders SET name = $1, due_time = $2, registrant = $3, note = $4, responsible = $5, status = $6 WHERE id = $7';
                pool.query(updateQuery, [job, formattedDeadline, registrantId, description, responsibleId, statusInt, orderId], (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.status(200).send('已成功更新待辦');
                });
            });
        });
    });
});

app.put('/Sinica/:id', (req, res) => {
    const { job, deadline, author, description, responsibleName, status } = req.body;

    const statusMapping = {
        '未完成': 0,
        '已完成': 1,
        '釘選': 2
    };

    const orderId = req.params.id;

    // const statusInt = status;
    const statusInt = statusMapping[status];

    if (statusInt === undefined) {
        return res.status(400).send('Invalid status');
    }

    if (deadline === null) {
        return res.status(400).send('Invalid deadline');
    }

    const registrantQuery = `SELECT id FROM users WHERE name = $1`;
    const responsibleQuery = 'SELECT id FROM users WHERE name = $1';
    const orderQuery = 'SELECT * FROM Sinica WHERE id = $1';

    const adjustedDeadline = new Date(deadline);
    adjustedDeadline.setDate(adjustedDeadline.getDate() + 1);
    const formattedDeadline = adjustedDeadline.toISOString().substring(0, 10);

    pool.query(orderQuery, [orderId], (err, orderResult) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (orderResult.rows.length === 0) {
            return res.status(404).send('Order not found');
        }

        pool.query(registrantQuery, [author], (err, registrantResult) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (registrantResult.rows.length === 0) {
                return res.status(404).send('Author not found');
            }

            const registrantId = registrantResult.rows[0].id;

            pool.query(responsibleQuery, [responsibleName], (err, responsibleResult) => {
                if (err) {
                    return res.status(500).send(err);
                }

                if (responsibleResult.rows.length === 0) {
                    return res.status(404).send('Responsible person not found');
                }

                const responsibleId = responsibleResult.rows[0].id;

                const updateQuery = 'UPDATE Sinica SET name = $1, due_time = $2, registrant = $3, note = $4, responsible = $5, status = $6 WHERE id = $7';
                pool.query(updateQuery, [job, formattedDeadline, registrantId, description, responsibleId, statusInt, orderId], (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.status(200).send('已成功更新待辦');
                });
            });
        });
    });
});

app.put('/Events-Todo/:id', (req, res) => {
    const { job, deadline, author, description, responsibleName, status } = req.body;

    const statusMapping = {
        '未完成': 0,
        '已完成': 1,
        '釘選': 2
    };

    console.log('Received order:', req.body);

    const orderId = req.params.id;

    // const statusInt = status;
    const statusInt = statusMapping[status];

    if (statusInt === undefined) {
        return res.status(400).send('Invalid status');
    }

    if (deadline === null) {
        return res.status(400).send('Invalid deadline');
    }

    const registrantQuery = `SELECT id FROM users WHERE name = $1`;
    const responsibleQuery = 'SELECT id FROM users WHERE name = $1';
    const orderQuery = 'SELECT * FROM eventsTodo WHERE id = $1';

    const adjustedDeadline = new Date(deadline);
    adjustedDeadline.setDate(adjustedDeadline.getDate() + 1);
    const formattedDeadline = adjustedDeadline.toISOString().substring(0, 10);

    pool.query(orderQuery, [orderId], (err, orderResult) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (orderResult.rows.length === 0) {
            return res.status(404).send('Order not found');
        }

        pool.query(registrantQuery, [author], (err, registrantResult) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (registrantResult.rows.length === 0) {
                return res.status(404).send('Author not found');
            }

            const registrantId = registrantResult.rows[0].id;

            pool.query(responsibleQuery, [responsibleName], (err, responsibleResult) => {
                if (err) {
                    return res.status(500).send(err);
                }

                if (responsibleResult.rows.length === 0) {
                    return res.status(404).send('Responsible person not found');
                }

                const responsibleId = responsibleResult.rows[0].id;

                const updateQuery = 'UPDATE eventsTodo SET name = $1, due_time = $2, registrant = $3, note = $4, responsible = $5, status = $6 WHERE id = $7';
                pool.query(updateQuery, [job, formattedDeadline, registrantId, description, responsibleId, statusInt, orderId], (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.status(200).send('已成功更新待辦');
                });
            });
        });
    });
});

// 刪除資料串 ----------------------------------------------------

app.delete('/Restock-and-Refund/:id', (req, res) => {
    const orderId = req.params.id;

    const deleteQuery = 'DELETE FROM restockandrefund WHERE id = $1';
    pool.query(deleteQuery, [orderId], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.rowCount === 0) {
            return res.status(404).send('Order not found');
        }
        res.status(200).send('已成功刪除待辦事項');
    });
});

app.delete('/Online-orders/:id', (req, res) => {
    const orderId = req.params.id;

    const deleteQuery = 'DELETE FROM onlineorders WHERE id = $1';
    pool.query(deleteQuery, [orderId], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.rowCount === 0) {
            return res.status(404).send('Order not found');
        }
        res.status(200).send('已成功刪除待辦事項');
    });
});

app.delete('/Physical-orders/:id', (req, res) => {
    const orderId = req.params.id;

    const deleteQuery = 'DELETE FROM physicalorders WHERE id = $1';
    pool.query(deleteQuery, [orderId], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.rowCount === 0) {
            return res.status(404).send('Order not found');
        }
        res.status(200).send('已成功刪除待辦事項');
    });
});

app.delete('/Sinica/:id', (req, res) => {
    const orderId = req.params.id;

    const deleteQuery = 'DELETE FROM sinica WHERE id = $1';
    pool.query(deleteQuery, [orderId], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.rowCount === 0) {
            return res.status(404).send('Order not found');
        }
        res.status(200).send('已成功刪除待辦事項');
    });
});

app.delete('/Events-Todo/:id', (req, res) => {
    const orderId = req.params.id;

    const deleteQuery = 'DELETE FROM eventstodo WHERE id = $1';
    pool.query(deleteQuery, [orderId], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.rowCount === 0) {
            return res.status(404).send('Order not found');
        }
        res.status(200).send('已成功刪除待辦事項');
    });
});


// 未來可能用到

/*app.put('/online-orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const updateQuery = 'UPDATE OnlineOrders SET status = $1 WHERE id = $2';
    pool.query(updateQuery, [status, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.rowCount === 0) {
            return res.status(404).send('Order not found');
        }
        res.send('已成功更改狀態');
    });
});*/

/*app.put('/Physical-orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const updateQuery = 'UPDATE PhysicalOrders SET status = $1 WHERE id = $2';
    pool.query(updateQuery, [status, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.rowCount === 0) {
            return res.status(404).send('Order not found');
        }
        res.send('已成功更改狀態');
    });
});*/

/*app.put('/Sinica/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const updateQuery = 'UPDATE Sinica SET status = $1 WHERE id = $2';
    pool.query(updateQuery, [status, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.rowCount === 0) {
            return res.status(404).send('Order not found');
        }
        res.send('已成功更改狀態');
    });
});*/

/*app.put('/Restock-and-Refund/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const updateQuery = 'UPDATE RestockAndRefund SET status = $1 WHERE id = $2';
    pool.query(updateQuery, [status, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.rowCount === 0) {
            return res.status(404).send('Order not found');
        }
        res.send('已更改狀態');
    });
});*/

/*app.put('/Events-Todo/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const updateQuery = 'UPDATE EventsTodo SET status = $1 WHERE id = $2';
    pool.query(updateQuery, [status, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.rowCount === 0) {
            return res.status(404).send('Order not found');
        }
        res.send('已成功更改狀態');
    });
});*/

// 不使用 統一從 overview 拿資料了----------------------------------------------------

app.get('/Home', (req, res) => {
    let baseQuery = `
        SELECT 
            t.id, 
            t.name, 
            t.note, 
            u1.name AS registrant, 
            u2.name AS responsible,
            t.status,
            t.due_time, 
            'eventsTodo' AS source_table
        FROM eventsTodo t
        LEFT JOIN users u1 ON t.registrant = u1.id
        LEFT JOIN users u2 ON t.responsible = u2.id

        UNION

        SELECT
            o.id,
            o.name,
            o.note,
            u1.name AS registrant,
            u2.name AS responsible,
            o.status,
            o.due_time, 
            'onlineorders' AS source_table
        FROM onlineorders o
        LEFT JOIN users u1 ON o.registrant = u1.id
        LEFT JOIN users u2 ON o.responsible = u2.id
        WHERE Date(o.due_time) = CURRENT_DATE

        UNION

        SELECT
            p.id,
            p.name,
            p.note,
            u1.name AS registrant,
            u2.name AS responsible,
            p.status,
            p.due_time,
            'physicalorders' AS source_table
        FROM physicalorders p
        LEFT JOIN users u1 ON p.registrant = u1.id
        LEFT JOIN users u2 ON p.responsible = u2.id
        WHERE Date(p.due_time) = CURRENT_DATE

        UNION

        SELECT
            r.id,
            r.name,
            r.note,
            u1.name AS registrant,
            u2.name AS responsible,
            r.status,
            r.due_time,
            'restockandrefund' AS source_table
        FROM restockandrefund r
        LEFT JOIN users u1 ON r.registrant = u1.id
        LEFT JOIN users u2 ON r.responsible = u2.id
        WHERE Date(r.due_time) = CURRENT_DATE

        UNION

        SELECT
            s.id,
            s.name,
            s.note,
            u1.name AS registrant,
            u2.name AS responsible,
            s.status,
            s.due_time,
            'sinica' AS source_table
        FROM sinica s
        LEFT JOIN users u1 ON s.registrant = u1.id
        LEFT JOIN users u2 ON s.responsible = u2.id
        WHERE Date(s.due_time) = CURRENT_DATE
    `;

    pool.query(baseQuery, (err, results) => {
        if (err) {
            console.log('Error executing query:', err);
            return res.status(500).send(err);
        } else {
            console.log('Query executed successfully. Rows:', results.rows);
            res.json(results.rows);
        }
    });
});

app.get('/Users', (req, res) => {
    let baseQuery = `
        SELECT id, name
        FROM users
    `;

    pool.query(baseQuery, (err, results) => {
        if (err) {
            console.log('Error executing query:', err);
            return res.status(500).send(err);
        } else {
            console.log('Query executed successfully. Rows:', results.rows);
            res.json(results.rows);
        }
    });
});

app.get('/Online-orders', (req, res) => {
    const { filter } = req.query;

    let baseQuery = `
        SELECT id, job, deadline, author, description, responsible, status
        FROM OnlineOrders
    `;

    if (filter === 'old_to_new') {
        baseQuery += ' ORDER BY created_at ASC';
    } else if (filter === 'new_to_old') {
        baseQuery += ' ORDER BY created_at DESC';
    } else if (filter === 'completed') {
        baseQuery += ' WHERE status = "已完成"';
    } else if (filter === 'incompleted') {
        baseQuery += ' WHERE status = "未完成"';
    } else if (filter === 'pin') {
        baseQuery += ' WHERE status = "釘選"';
    }

    pool.query(baseQuery, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results.rows);
    });
});

app.get('/Online-orders', (req, res) => {
    const { filter } = req.query;

    let baseQuery = `
        SELECT id, note, registrant, responsible, status
        FROM OnlineOrders
    `;

    if (filter === 'old_to_new') {
        baseQuery += ' ORDER BY created_at ASC';
    } else if (filter === 'new_to_old') {
        baseQuery += ' ORDER BY created_at DESC';
    } else if (filter === 'completed') {
        baseQuery += ' WHERE status = 1';
    } else {
        baseQuery += ' WHERE status = 0';
    }

    pool.query(baseQuery, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results.rows);
    });
});

app.get('/Physical-orders', (req, res) => {
    const { filter } = req.query;

    let baseQuery = `
        SELECT id, note, registrant, responsible, status
        FROM PhysicalOrders
    `;

    if (filter === 'old_to_new') {
        baseQuery += ' ORDER BY created_at ASC';
    } else if (filter === 'new_to_old') {
        baseQuery += ' ORDER BY created_at DESC';
    } else if (filter === 'completed') {
        baseQuery += ' WHERE status = 1';
    } else {
        baseQuery += ' WHERE status = 0';
    }

    pool.query(baseQuery, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results.rows);
    });
});

app.get('/Sinica', (req, res) => {
    const { filter } = req.query;

    let baseQuery = `
        SELECT id, note, registrant, responsible, status
        FROM Sinica
    `;

    if (filter === 'old_to_new') {
        baseQuery += ' ORDER BY created_at ASC';
    } else if (filter === 'new_to_old') {
        baseQuery += ' ORDER BY created_at DESC';
    } else if (filter === 'completed') {
        baseQuery += ' WHERE status = 1';
    } else {
        baseQuery += ' WHERE status = 0';
    }

    pool.query(baseQuery, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results.rows);
    });
});

// 啟動伺服器
app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
});
