const express = require('express');
const router = express.Router();
const { auth, isParent } = require('../middleware/auth');
const {
    getFamilyGroup,
    addFamilyMember,
    removeFamilyMember,
    updateFamilyGroup
} = require('../controller/familyController');

/**
 * @swagger
 * components:
 *   responses:
 *     UnauthorizedError:
 *       description: Access token is missing or invalid
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Authentication failed
 * 
 * /api/family:
 *   get:
 *     tags: [Family]
 *     summary: Get family group details
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Family group details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FamilyGroup'
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Authentication failed
 *       404:
 *         description: Family group not found
 */
router.get('/', auth, getFamilyGroup);

/**
 * @swagger
 * /api/family/member:
 *   post:
 *     tags: [Family]
 *     summary: Add a member to family group
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - memberId
 *             properties:
 *               memberId:
 *                 type: string
 *                 description: ID of the user to add as family member
 *     responses:
 *       200:
 *         description: Member added successfully
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Authentication failed
 *       403:
 *         description: Only parents can add family members
 *       404:
 *         description: User or family group not found
 */
router.post('/member', auth, isParent, addFamilyMember);

/**
 * @swagger
 * /api/family/member/{memberId}:
 *   delete:
 *     tags: [Family]
 *     summary: Remove a member from family group
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the member to remove
 *     responses:
 *       200:
 *         description: Member removed successfully
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Authentication failed
 *       403:
 *         description: Only parents can remove family members
 *       404:
 *         description: Family group not found
 */
router.delete('/member/:memberId', auth, isParent, removeFamilyMember);

/**
 * @swagger
 * /api/family:
 *   put:
 *     tags: [Family]
 *     summary: Update family group details
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name for the family group
 *     responses:
 *       200:
 *         description: Family group updated successfully
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Authentication failed
 *       403:
 *         description: Only parents can update family group
 *       404:
 *         description: Family group not found
 */
router.put('/', auth, isParent, updateFamilyGroup);

module.exports = router;
