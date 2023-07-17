const { response } = require("express");
const {Usuario, PostUser} = require('../models');
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = require('mongoose').Types;
const cloudinary = require('cloudinary').v2;



const getPostUser = async(req, res= response) =>{


    try {

        const id = req.usuario._id;
        const query = {
            user:id,
            state: true
        }
        const findPostUser = await PostUser.find(query).populate('user','name')
       

        return res.status(200).json({
            header: [{
                error:'NO ERROR',
                code: 200,
            }],
            body:[{
                publicaciones:findPostUser
            }]
        })

    
    } catch (error) {
      console.log('GetPostUser error ==> '+error)
         return res.status(500).json({
              header: [{
                   error: 'tuvimos un error, por favor intentalo mas tarde',
                   code: 500,
              }],
              body: [{}]
         })
    }

}

const getAllPostUser = async(req, res = response) => {


    try {

        const {limit, desde} = req.query;
        const query = {state: true}
        const [total, post] = await Promise.all([
            PostUser.countDocuments(query),
            PostUser.find(query)
            .limit(Number(limit))
            .skip(Number(desde))
        ]);
        res.status(200).json({
            header: [{
                error:'NO ERROR',
                code: 200,
            }],
            body:[{
                total,
                post
            }]
        }) 

        
    
    
    } catch (error) {
      console.log('GetAllPostUser error ==> '+error)
         return res.status(500).json({
              header: [{
                   error: 'tuvimos un error, por favor intentalo mas tarde',
                   code: 500,
              }],
              body: [{}]
         })
    }

}

const getAllPostUserById = async(req, res = response) => {

    const {id} = req.params;

    const query ={
        _id: new ObjectId(id),
        state: true
    }

    try {

        const findPostUser = await PostUser.find(query).populate('user','name');

        return res.status(200).json({
            header: [{
                error:'NO ERROR',
                code: 200,
            }],
            body:[{
                publicacion:findPostUser
            }]
        })
    
    } catch (error) {
      console.log('getAllPostUserByid error ==> '+error)
         return res.status(500).json({
              header: [{
                   error: 'tuvimos un error, por favor intentalo mas tarde',
                   code: 500,
              }],
              body: [{}]
         })
    }
    
}

const CreatePostUser = async(req, res = response) => {

    const {title, description, img} = req.body;

    if(title == '' || title == undefined || title == null){
        return res.status(200).json({
            header: [{
                error:`El titulo es necesario para crear tu post.`,
                code: 400,
            }],
            body:[{}]
        })
    }
    if(description == '' || description == undefined || description == null){
        return res.status(200).json({
            header: [{
                error:`la descripción es necesario para crear tu post.`,
                code: 400,
            }],
            body:[{}]
        })
    }
        

  try {
    const data = {
        title:title.toUpperCase(),
        description:description,
        img: img,
        user: req.usuario._id,
    }

    const postUser = new PostUser(data)

    await postUser.save();

    res.status(200).json({
        header: [{
            error: 'NO ERROR',
            code: 200,
        }],
        body:[{
            msg: 'la publicacion se guardo correctamente',
            postUser
        }]
    })
  
  } catch (error) {
    console.log('CreatePostUser error ==> '+error)
       return res.status(500).json({
            header: [{
                 error: 'tuvimos un error, por favor intentalo mas tarde',
                 code: 500,
            }],
            body: [{}]
       })
  }

}

const updatePostUser = async(req, res = response) => {

    const {id} = req.params;
    const {...todo} = req.body

    if(id == '' || id == undefined || id == null){
        return res.status(200).json({
            header: [{
                error:`es requerida la publicacion para continuar`,
                code: 400,
            }],
            body:[{}]
        })
    }

    try {

        const findPostUserById = await PostUser.findById(id);

        if(!findPostUserById){
            return res.status(200).json({
                header: [{
                    error:`No existe esa publicacion`,
                    code: 400,
                }],
                body:[{}]
            })
        }


        const Post = await PostUser.findByIdAndUpdate(id, todo, {new: true});

        res.status(200).json({
            header: [{
                error: 'NO ERROR',
                code: 200,
            }],
            body:[{
                msg: 'El producto se actualizó correctamente',
                actualizacion:Post
            }]
        })
    
    
    } catch (error) {
      console.log('updatePostUser error ==> '+error)
         return res.status(500).json({
              header: [{
                   error: 'tuvimos un error, por favor intentalo mas tarde',
                   code: 500,
              }],
              body: [{}]
         })
    }

}

const deletePostUser = async(req, res = response) => {

    const {id} = req.params;

    if(id == '' || id == undefined || id == null){
        return res.status(200).json({
            header: [{
                error:`es requerida la publicacion para continuar`,
                code: 400,
            }],
            body:[{}]
        })
    }

    try {

        const findPostUserById = await PostUser.findById(id);

        if(!findPostUserById){
            return res.status(200).json({
                header: [{
                    error:`No existe esa publicacion`,
                    code: 400,
                }],
                body:[{}]
            })
        }


        //await PostUser.findByIdAndUpdate(id, {state:false}, {new: true});
       await PostUser.findByIdAndDelete(id,{new: true});

        res.status(200).json({
            header: [{
                error: 'NO ERROR',
                code: 200,
            }],
            body:[{
                msg: 'El producto se actualizó correctamente'
            }]
        })
    
    
    } catch (error) {
      console.log('deletePostUser error ==> '+error)
         return res.status(500).json({
              header: [{
                   error: 'tuvimos un error, por favor intentalo mas tarde',
                   code: 500,
              }],
              body: [{}]
         })
    }

}

module.exports = {
    getPostUser,
    getAllPostUser,
    getAllPostUserById,
    CreatePostUser,
    updatePostUser,
    deletePostUser
}