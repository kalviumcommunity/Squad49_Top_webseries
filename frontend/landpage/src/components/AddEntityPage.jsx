import React, { useState } from 'react';

function AddEntityPage() {
    const [entityName, setEntityName] = useState('');
    const [entityDescription, setEntityDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/entities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ entityName, entityDescription })
            });
            if (response.ok) {
                
            } else {
            }
        } catch (error) {
            console.error('Error adding entity:', error);
        }
    };

    return (
        <div>
            <h1>Add Entity</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="entity_name">Entity Name:</label>
                <input type="text" id="entity_name" value={entityName} onChange={(e) => setEntityName(e.target.value)} /><br /><br />
                <label htmlFor="entity_description">Entity Description:</label>
                <textarea id="entity_description" value={entityDescription} onChange={(e) => setEntityDescription(e.target.value)}></textarea><br /><br />
                <button type="submit">Add Entity</button>
            </form>
        </div>
    );
}

export default AddEntityPage;
