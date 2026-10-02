const router = require('express').Router();
const Record = require('../models/Record');
const auth = require('../middleware/auth');
router.get('/records/:kind', auth, async (req, res, next) => {
  try {
    if (!['restaurant', 'ngo', 'donation'].includes(req.params.kind)) return res.status(400).json({ message: 'Unknown record type.' });
    const records = await Record.find({ owner: req.userId, kind: req.params.kind }).sort({ createdAt: -1 }).lean();
    res.json(records.map(r => ({ id: r._id, ...r.data, updatedAt: r.updatedAt })));
  } catch (err) { next(err); }
});
router.post('/records/:kind', auth, async (req, res, next) => {
  try {
    if (!['restaurant', 'ngo', 'donation'].includes(req.params.kind)) return res.status(400).json({ message: 'Unknown record type.' });
    const record = await Record.create({ owner: req.userId, kind: req.params.kind, data: req.body });
    res.status(201).json({ id: record.id, ...record.data, updatedAt: record.updatedAt });
  } catch (err) { next(err); }
});
router.patch('/records/:kind/:id', auth, async (req, res, next) => {
  try {
    const record = await Record.findOne({ _id: req.params.id, owner: req.userId, kind: req.params.kind });
    if (!record) return res.status(404).json({ message: 'Record not found.' });
    record.data = { ...record.data.toObject?.() || record.data, ...req.body };
    await record.save();
    res.json({ id: record.id, ...record.data.toObject?.() || record.data, updatedAt: record.updatedAt });
  } catch (err) { next(err); }
});
router.delete('/records/:kind/:id', auth, async (req, res, next) => {
  try {
    const deleted = await Record.findOneAndDelete({ _id: req.params.id, owner: req.userId, kind: req.params.kind });
    if (!deleted) return res.status(404).json({ message: 'Record not found.' });
    res.status(204).end();
  } catch (err) { next(err); }
});
module.exports = router;
