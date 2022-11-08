const asyncHandler = require('express-async-handler')
const catchAsyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/ErrorResponse')
const Comment = require('../models/comment/comment.js')
const { reset } = require('nodemon')

class commentControllers {
  // @desc Create new comment
  // @route   POST /api/comments
  // @access  Private
  addComment = catchAsyncHandler(async (req, res) => {
    const { comment, productId } = req.body
    const cmt = {
      user: req.user._id,
      name: req.user.name,
      product: Object(productId),
      comment,
    }
    const addComment = await Comment.create(cmt)
    if (addComment) {
      res.status(201).json({
        success: true,
        addComment,
      })
    } else {
      res.status(404).json({
        success: false,
        message: "ERROR: Couldn't add comment",
      })
    }
  })
  // @desc Update  comment
  // @route   Put /api/comments/:id
  // @access  Private
  updateComment = catchAsyncHandler(async (req, res) => {
    const { comment } = req.body
    const cmt = await Comment.findById(req.params.id)
    if (cmt.user.toString() === req.user._id.toString()) {
      cmt.comment = comment
      await cmt.save()
      res.status(201).json({
        success: true,
        comment: cmt,
      })
    } else {
      res.status(404).json({
        success: false,
        message: "ERROR: Couldn't add comment",
      })
    }
  })
  // @desc DELETE  comment
  // @route   Delete /api/comments/:id
  // @access  Private
  deleteComment = catchAsyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id)
    if (comment) {
      await comment.remove()
      res.status(201).json({
        success: true,
        message: 'Deleted comment',
      })
    } else {
      res.status(404).json({
        success: false,
        message: 'not found comment',
      })
    }
  })
}

module.exports = new commentControllers()
