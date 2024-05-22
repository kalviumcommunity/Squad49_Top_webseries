import React, { useState, useEffect } from 'react';

function AddEntityPage({ entityId }) {
    const [entityName, setEntityName] = useState('');
    const [entityDescription, setEntityDescription] = useState('');
    const [entities, setEntities] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');

    useEffect(() => {
        fetchUsers();
        if (entityId) {
            fetch(`http://localhost:3000/api/entities/${entityId}`, {
                headers: {
                    'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    setEntityName(data.entityName);
                    setEntityDescription(data.entityDescription);
                })
                .catch(error => console.error('Error fetching entity details:', error));
        }

        fetchEntities();
    }, [entityId]);

    const fetchEntities = () => {
        const url = selectedUser ? `http://localhost:3000/api/entities?created_by=${selectedUser}` : 'http://localhost:3000/api/entities';
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setEntities(data);
                console.log('Entities fetched:', data);
            })
            .catch(error => console.error('Error fetching entities:', error));
    };

    const fetchUsers = () => {
        fetch('http://localhost:3000/api/users') // Assuming you have an endpoint to get all users
            .then(response => response.json())
            .then(data => {
                setUsers(data);
            })
            .catch(error => console.error('Error fetching users:', error));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = entityId ? `http://localhost:3000/api/entities/${entityId}` : 'http://localhost:3000/api/entities';
            const method = entityId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
                },
                body: JSON.stringify({ entityName, entityDescription })
            });

            if (response.ok) {
                fetchEntities();
                setEntityName('');
                setEntityDescription('');
            } else {
                console.error('Failed to save entity:', await response.text());
            }
        } catch (error) {
            console.error('Error adding/updating entity:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this entity?')) {
            try {
                const response = await fetch(`http://localhost:3000/api/entities/${entityId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
                    }
                });

                if (response.ok) {
                    fetchEntities();
                } else {
                    console.error('Failed to delete entity:', await response.text());
                }
            } catch (error) {
                console.error('Error deleting entity:', error);
            }
        }
    };

    return (
        <div>
            <h1>{entityId ? 'Update Entity' : 'Add Entity'}</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="entity_name">Entity Name:</label>
                <input 
                    type="text" 
                    id="entity_name" 
                    value={entityName} 
                    onChange={(e) => setEntityName(e.target.value)} 
                /><br /><br />
                
                <label htmlFor="entity_description">Entity Description:</label>
                <input 
                    type="text" 
                    id="entity_description" 
                    value={entityDescription} 
                    onChange={(e) => setEntityDescription(e.target.value)} 
                /><br /><br />

                <button type="submit">{entityId ? 'Update' : 'Add'} Entity</button>
                {entityId && <button type="button" onClick={handleDelete}>Delete Entity</button>}
            </form>
            <h2>Filter Entities by User:</h2>
            <select onChange={(e) => setSelectedUser(e.target.value)}>
                <option value="">Select a user</option>
                {users.map(user => (
                    <option key={user._id} value={user._id}>{user.username}</option>
                ))}
            </select>
            <button onClick={fetchEntities}>Filter</button>
            <h2>List of Entities:</h2>
            <ul>
                {entities.map(entity => (
                    <li key={entity._id}>{entity.entityName}</li>
                ))}
            </ul>
        </div>
    );
}

export default AddEntityPage;
