// const API_URL = 'http://localhost:3000';
// const API_URL = 'https://tonsan-test-backend.onrender.com/';
const API_URL = 'https://tonsan-backend.onrender.com';

// create

export const createUser = async (username) => {
    const response = await fetch(`${API_URL}/Users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
    });
    if (!response.ok) {
        throw new Error('Failed to create user');
    }
    return response.json();
};

export const createOrder = async (order) => {
    const response = await fetch(`${API_URL}/Online-orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }
    return response.json();
};

export const createPhysicalOrder = async (order) => {
    const response = await fetch(`${API_URL}/Physical-orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }
    return response.json();
};

export const createRiverOrder = async (order) => {
    const response = await fetch(`${API_URL}/Sinica`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    });
    if (!response.ok) {
      throw new Error('Failed to create river order');

    }
    return response.json();
};

export const restockAndRefund = async (order) => {
    console.log('order:', order);
    const response = await fetch(`${API_URL}/Restock-and-Refund`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }
    return response.json();
};

export const eventsToDo = async (order) => {
    const response = await fetch(`${API_URL}/Events-todo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }
    return response.json();
};

// 今日代辦

export const Todaytodo = async () => {
    const response = await fetch(`${API_URL}/Home`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
  
    const data = await response.json();
    console.log('Data from API:', data); // test
    return data || []; 
}

// Get 所有資料

export const Overview = async () => {
    const response = await fetch(`${API_URL}/Works`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
  
    const data = await response.json();
    console.log('Data from API:', data); // test
    return data || []; 
}

export const showusers = async () => {
    const response = await fetch(`${API_URL}/Users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
  
    const data = await response.json();
    console.log('Data from API:', data); // test
    return data || []; 
}

export const deleteUser = async (orderId) => {
    const response = await fetch(`${API_URL}/Users/${orderId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to delete order: ${error}`);
    }
    return response.text(); // 这里改为返回文本
  }

  export const editUser = async (employee, employeeId) => {
    console.log('employee:', employee);
    console.log('employeeId:', employeeId);
    const response = await fetch(`${API_URL}/Users/${employeeId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }
    return response.text();
  };

// 編輯訂單

export const editDeliverOrder = async (order, orderId) => {
    const response = await fetch(`${API_URL}/Restock-and-Refund/${orderId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }
    return response.text();
  };

export const editOnlineOrder = async (order, orderId) => {
  const response = await fetch(`${API_URL}/Online-orders/${orderId}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
  });
  if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
  }
  return response.text();
}

export const editPhysicalOrder = async (order, orderId) => {
  const response = await fetch(`${API_URL}/Physical-orders/${orderId}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
  });
  if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
  }
  return response.text();
}

export const editRiverOrder = async (order, orderId) => {
  const response = await fetch(`${API_URL}/Sinica/${orderId}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
  });
  if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
  }
  return response.text();
}

export const editEventsToDo = async (order, orderId) => {
  const response = await fetch(`${API_URL}/Events-todo/${orderId}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
  });
  if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
  }
  return response.text();
}

// 刪除訂單

export const deleteDeliverOrder = async (orderId) => {
  const response = await fetch(`${API_URL}/Restock-and-Refund/${orderId}`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
      },
  });
  if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to delete order: ${error}`);
  }
  return response.text(); // 这里改为返回文本
};

export const deleteOnlineOrder = async (orderId) => {
  const response = await fetch(`${API_URL}/Online-orders/${orderId}`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
      },
  });
  if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to delete order: ${error}`);
  }
  return response.text(); // 这里改为返回文本
}

export const deletePhysicalOrder = async (orderId) => {
  const response = await fetch(`${API_URL}/Physical-orders/${orderId}`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
      },
  });
  if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to delete order: ${error}`);
  }
  return response.text(); // 这里改为返回文本
}

export const deleteRiverOrder = async (orderId) => {
  const response = await fetch(`${API_URL}/Sinica/${orderId}`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
      },
  });
  if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to delete order: ${error}`);
  }
  return response.text(); // 这里改为返回文本
}

export const deleteEventsToDo = async (orderId) => {
  const response = await fetch(`${API_URL}/Events-todo/${orderId}`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
      },
  });
  if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to delete order: ${error}`);
  }
  return response.text(); // 这里改为返回文本
}

// // 沒用到

// export const showonlineorders = async () => {
//     const response = await fetch(`${API_URL}/Online-orders`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
  
//     if (!response.ok) {
//       const error = await response.text();
//       throw new Error(error);
//     }
  
//     const data = await response.json();
//     console.log('Data from API:', data); // test
//     return data || []; 
// }

// export const showeventstodo = async () => {
//     const response = await fetch(`${API_URL}/Events-todo`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
  
//     if (!response.ok) {
//       const error = await response.text();
//       throw new Error(error);
//     }
  
//     const data = await response.json();
//     console.log('Data from API:', data); // test
//     return data || []; 
// }

// export const showphysicalorders = async () => {
//     const response = await fetch(`${API_URL}/Physical-orders`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
  
//     if (!response.ok) {
//       const error = await response.text();
//       throw new Error(error);
//     }
  
//     const data = await response.json();
//     console.log('Data from API:', data); // test
//     return data || []; 
// }

// export const showsinica = async () => {
//     const response = await fetch(`${API_URL}/Sinica`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
  
//     if (!response.ok) {
//       const error = await response.text();
//       throw new Error(error);
//     }
  
//     const data = await response.json();
//     console.log('Data from API:', data); // test
//     return data || []; 
// }

// export const showrestockandrefund = async () => {
//     const response = await fetch(`${API_URL}/Restock-and-Refund`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
  
//     if (!response.ok) {
//       const error = await response.text();
//       throw new Error(error);
//     }
  
//     const data = await response.json();
//     console.log('Data from API:', data); // test
//     return data || []; 
// }