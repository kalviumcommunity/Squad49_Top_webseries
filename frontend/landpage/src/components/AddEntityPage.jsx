import React, { useState, useEffect } from 'react';

function AddEntityPage({ entityId }) {
    const [entityName, setEntityName] = useState('');
    const [entityDescription, setEntityDescription] = useState('');
    const [entities, setEntities] = useState([]);

    useEffect(() => {
        if (entityId) {
            fetch(`/api/entities/${entityId}`)
                .then(response => response.json())
                .then(data => {
                    setEntityName(data.entityName);
                    setEntityDescription(data.entityDescription);
                })
                .catch(error => console.error('Error fetching entity details:', error));
        }

        fetch('/api/entities')
            .then(response => response.json())
            .then(data => setEntities(data))
            .catch(error => console.error('Error fetching entities:', error));
    }, [entityId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let url = '/api/entities';
            let method = 'POST';
            
            if (entityId) {
                url += `/${entityId}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ entityName, entityDescription })
            });

            if (response.ok) {
                const updatedEntities = await response.json();
                setEntities(updatedEntities);
            } else {
            }
        } catch (error) {
            console.error('Error adding/updating entity:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this entity?')) {
            try {
                const response = await fetch(`/api/entities/${entityId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    const updatedEntities = await response.json();
                    setEntities(updatedEntities);
                } else {
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
                <input type="text" id="entity_name" value={entityName} onChange={(e) => setEntityName(e.target.value)} /><br /><br />
                <label htmlFor="entity_description">Entity Description:</label>
                <textarea id="entity_description" value={entityDescription} onChange={(e) => setEntityDescription(e.target.value)}></textarea><br /><br />
                <button type="submit">{entityId ? 'Update' : 'Add'} Entity</button>
                {entityId && <button type="button" onClick={handleDelete}>Delete Entity</button>}
            </form>
            <h2>List of Entities:</h2>
            <ul>
                {entities.map(entity => (
                    <li key={entity.id}>{entity.entityName}</li>
                ))}
            </ul>
        </div>
    );
}

export default AddEntityPage;
