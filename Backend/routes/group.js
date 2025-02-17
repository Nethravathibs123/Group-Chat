
const {Router}=require('express');
const router=Router();

const groupController=require('../controllers/group');
const auth=require('../middleware/auth')

router.post('/',auth,groupController.createGroup);
router.post('/:groupId/join',auth,groupController.joinGroup2);
router.get('/',auth,groupController.getGroup);
router.get('/:groupId/messages',auth,groupController.getAllMessage);
router.post('/:groupId/messages',auth,groupController.newMessage);
router.post('/join',auth,groupController.JoinGroup);
router.patch("/:groupId/admins",auth,groupController.updateAdminStatus);
router.delete('/:groupId/members/:email',auth,groupController.removeUserFromGroup)
router.post('/:groupId/members',auth,groupController.getMemberByEmail)  
router.post('/:groupId/archive', auth, groupController.archiveMessages);




module.exports=router
