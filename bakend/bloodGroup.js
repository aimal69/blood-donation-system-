const express = require('express');
const router = express.Router();
const db = require('./database');

function getStockStatus(quantity) {
    if (quantity < 100) return { class: 'rejected', text: 'Critical Low' };
    if (quantity <= 300) return { class: 'pending', text: 'Low Stock' };
    if (quantity <= 500) return { class: 'active', text: 'Good Stock' };
    return { class: 'active', text: 'Excellent Stock' };
}

router.get('/', async (req, res) => {
    try {
        const result = await db.getMany('SELECT * FROM blood_groups ORDER BY blood_type');

        if (result.success) {
            const bloodGroups = result.data.map(group => ({
                ...group,
                stock_status: getStockStatus(group.quantity)
            }));

            res.json({
                success: true,
                data: bloodGroups,
                count: bloodGroups.length
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error fetching blood groups',
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const result = await db.getOne('SELECT * FROM blood_groups WHERE id = ?', [req.params.id]);

        if (result.success && result.data) {
            res.json({
                success: true,
                data: {
                    ...result.data,
                    stock_status: getStockStatus(result.data.quantity)
                }
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Blood group not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const { id, blood_type, quantity } = req.body;

        if (!id || !blood_type || quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: id, blood_type, quantity'
            });
        }

        const existing = await db.getOne('SELECT id FROM blood_groups WHERE id = ?', [id]);
        if (existing.success && existing.data) {
            return res.status(400).json({
                success: false,
                message: 'Blood group ID already exists'
            });
        }

        const result = await db.insert('INSERT INTO blood_groups (id, blood_type, quantity) VALUES (?, ?, ?)', [id, blood_type, quantity]);

        if (result.success) {
            res.status(201).json({
                success: true,
                message: 'Blood group created successfully',
                data: {
                    id, blood_type, quantity,
                    last_updated: new Date().toISOString().split('T')[0],
                    stock_status: getStockStatus(quantity)
                }
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error creating blood group',
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { blood_type, quantity } = req.body;

        if (!blood_type || quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: blood_type, quantity'
            });
        }

        const existing = await db.getOne('SELECT id FROM blood_groups WHERE id = ?', [id]);
        if (!existing.success || !existing.data) {
            return res.status(404).json({
                success: false,
                message: 'Blood group not found'
            });
        }

        const result = await db.update('UPDATE blood_groups SET blood_type = ?, quantity = ?, last_updated = CURRENT_DATE WHERE id = ?', [blood_type, quantity, id]);

        if (result.success) {
            res.json({
                success: true,
                message: 'Blood group updated successfully',
                data: {
                    id, blood_type, quantity,
                    last_updated: new Date().toISOString().split('T')[0],
                    stock_status: getStockStatus(quantity)
                }
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error updating blood group',
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await db.getOne('SELECT id FROM blood_groups WHERE id = ?', [id]);
        if (!existing.success || !existing.data) {
            return res.status(404).json({
                success: false,
                message: 'Blood group not found'
            });
        }

        const result = await db.remove('DELETE FROM blood_groups WHERE id = ?', [id]);

        if (result.success) {
            res.json({
                success: true,
                message: 'Blood group deleted successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error deleting blood group',
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;
