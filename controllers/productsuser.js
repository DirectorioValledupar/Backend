const { response } = require("express");
const {ProductUser} = require('../models');
const { ObjectId } = require('mongoose').Types;
const {CategoryUser} = require('../models');
const {Directory, Usuario, Sales} = require('../models');
const { dateFormat } = require("../helpers/helpersfunction");


const obtenerTodasProductByUserID= async(req, res= response) => {

try {
    const {id} = req.usuario._id
    const query = {state: true}
    const findProduct = await ProductUser.find({
        user: ObjectId(id),
        state:true

    }).populate('user','name')
    const countCategories = await ProductUser.countDocuments({
        query,
        user: req.usuario._id,
        state:true
    })

    if(findProduct =='' || findProduct == null || findProduct == undefined ){
        return res.status(200).json({
            header: [{
                error:'No tienes productos registrados',
                code: 200,
            }],
            body:[{}]
        }) 
    }

    return res.status(200).json({
        header: [{
            error:'NO ERROR',
            code: 200,
        }],
        body:[{
            total: countCategories,
            Products:findProduct
        }]
    })


} catch (error) {
  console.log('obtenerTodasProductByUserID error ==> '+error)
     return res.status(500).json({
          header: [{
               error: 'tuvimos un error, por favor intentalo mas tarde',
               code: 500,
          }],
          body: [{}]
     })
}
    
}

const obtenerProductoByIdCategory = async( req, res= response)=> {

 try {
    const {id} = req.params;
    const query = {state: true}

    const findId = await ProductUser.find({
        category: ObjectId(id),
        state:true

    })

    const findCategoriesByID = await CategoryUser.find({
        _id: ObjectId(id),
        state:true

    }).populate('user','name')

    const countCategories = await ProductUser.countDocuments({
        query,
        category: ObjectId(id),
        state:true
    })

    if(!findId){
        return res.status(200).json({
            header: [{
                error:`No existe ese producto registrado`,
                code: 400,
            }],
            body:[{}]
        })
    }

    return res.status(200).json({
        header: [{
            error:'NO ERROR',
            code: 200,
        }],
        body:[{
            total: countCategories,
            product:findId,
            category:findCategoriesByID
        }]
    })
 
 } catch (error) {
   console.log('obtenerProductoByIdCategory error ==> '+error)
      return res.status(500).json({
           header: [{
                error: 'tuvimos un error, por favor intentalo mas tarde',
                code: 500,
           }],
           body: [{}]
      })
 }
}

const obtenerProductById = async(req, res=response)=> {
   try {
    const {id} = req.params;

    const findId = await ProductUser.find({
        _id: ObjectId(id),
        state:true
    });

    const findCategoriesByID = await CategoryUser.find({
        _id: findId[0].category,
        state:true
 
    }).populate('user','name');

    let findSales = await Sales.findOne({
        productId: id
    })

    if(findSales){
        const date = new Date();
        const actual = date.toLocaleString("es-CO");   
        const actualDate = dateFormat(actual)
    
        const totalDate = findSales.time - actualDate;
    
        if(findSales.state == false || totalDate < 0){
            findSales = null
        }
    }else if (findSales == null){
        findSales = null
    }

    const {
        name,
        model,
        startHour,
        endHour,
        numberContact,
        numberWhatsApp,
        adress,
        img,
        description,
        completeHour,
        lat,
        lng,
        time
    } = await Directory.findById({
        _id:findCategoriesByID[0].ideaId
    });

    if(!findId){
        return res.status(200).json({
            header: [{
                error:'el producto con ese ID no existe',
                code: 200,
            }],
            body:[{}]
        }) 
    }
    if(findId == '' || findId == null || findId == undefined){
        return res.status(200).json({
            header: [{
                error:'el producto fue eliminado',
                code: 200,
            }],
            body:[{}]
        })  
    }

    return res.status(200).json({
        header: [{
            error:'NO ERROR',
            code: 200,
        }],
        body:[{
            product:[{
                name:findId[0].name,
                description:findId[0].description,
                price:findId[0].price
            }],
            category:[{
                name:findCategoriesByID[0].name,
                user:findCategoriesByID[0].user.name,
            }],
            idea:[{
                name,
                model,
                startHour,
                endHour,
                numberContact,
                numberWhatsApp,
                adress,
                img,
                description,
                completeHour,
                lat,
                lng,
                time
            }],
            Offer:findSales
        }]
    })
   
   } catch (error) {
     console.log('obtenerProductById error ==> '+error)
        return res.status(500).json({
             header: [{
                  error: 'tuvimos un error, por favor intentalo mas tarde',
                  code: 500,
             }],
             body: [{}]
        })
   }
}

const crearProductUser = async(req, res= response) => {

   try {
    const {name, category, idea,...todo} = req.body

    if(idea == '' || idea == null || idea == undefined){
        return res.status(200).json({
            header: [{
                error:`No hay idea para crear el producto`,
                code: 400,
            }],
            body:[{}]
        })
    }

    if(category == '' || category == null || category == undefined){
        return res.status(200).json({
            header: [{
                error:`No hay categoria para crear el producto`,
                code: 400,
            }],
            body:[{}]
        })
    }

    if(name == '' || name == null || name == undefined){
        return res.status(200).json({
            header: [{
                error:`Por favor ingrese el nombre del producto`,
                code: 400,
            }],
            body:[{}]
        })
    }


    const productDB = await ProductUser.findOne({
        name:name.toUpperCase(),
        user:ObjectId(req.usuario._id)
   });

    if(productDB) {
        return res.status(200).json({
            header: [{
                error:`El producto ${name}, ya está registrado.`,
                code: 400,
            }],
            body:[{}]
        })
    }

    //Generar la data a guardar

    const data = {
        name:name.toUpperCase(),
        category: ObjectId(category),
        price:todo.price,
        idea,
        img:todo.img,
        description:todo.description,
        user: req.usuario._id,
    }


    const product = new ProductUser(data);

    //Guardar DB

    await product.save(); 


    res.status(200).json({
        header: [{
            error: 'NO ERROR',
            code: 200,
        }],
        body:[{
            msg: 'El producto se creó correctamente',
            product
        }]
    })
   
   } catch (error) {
     console.log('crearProductUser error ==> '+error)
        return res.status(500).json({
             header: [{
                  error: 'tuvimos un error, por favor intentalo mas tarde',
                  code: 500,
             }],
             body: [{}]
        })
   }

}

const actualizarProductUser = async(req, res = response) => {

   try {
    const {id} = req.params;
    const {state, user,...data} = req.body;

    const findId = await ProductUser.findById(id)

    if(!findId){
        return res.status(200).json({
            header: [{
                error:`No existe ese producto registrado`,
                code: 400,
            }],
            body:[{}]
        })
    }

    data.user = req.user;

    const category = await ProductUser.findByIdAndUpdate(id, data, {new: true});

    res.status(200).json({
        header: [{
            error: 'NO ERROR',
            code: 200,
        }],
        body:[{
            msg: 'El producto se actualizó correctamente',
            category
        }]
    })
   
   } catch (error) {
     console.log('actualizarProductUser error ==> '+error)
        return res.status(500).json({
             header: [{
                  error: 'tuvimos un error, por favor intentalo mas tarde',
                  code: 500,
             }],
             body: [{}]
        })
   }
}

const borrarProductUser =  async(req, res=response) => {

try {
    const {id} = req.params;

    const findId = await ProductUser.findById(id)

    if(!findId){
        return res.status(200).json({
            header: [{
                error:`No existe ese producto`,
                code: 400,
            }],
            body:[{}]
        })
    }

    
    const categoryDelete = await ProductUser.findByIdAndUpdate(id , {state:false}, {new:true});

    res.status(200).json({
        header: [{
            error: 'NO ERROR',
            code: 200,
        }],
        body:[{
            msg: 'El producto se borró correctamente',
            categoryDelete
        }]
    })

} catch (error) {
  console.log('borrarProductUser error ==> '+error)
     return res.status(500).json({
          header: [{
               error: 'tuvimos un error, por favor intentalo mas tarde',
               code: 500,
          }],
          body: [{}]
     })
}

}

const findProductsByName = async (req, res=response) => {

try {
    const {productName} = req.body

    const mesg = productName.toUpperCase().trim();

    if(mesg == '' || mesg == null || mesg == undefined){

        const findId = (await ProductUser.find({state:true}))

        return res.status(200).json({
            header: [{
                error:`NO ERROR`,
                code: 200,
            }],
            body:[{
                products: findId
            }]
        })

    }

    const findId = (await ProductUser.find({state:true})).filter(
        find => find.name.toUpperCase().includes(mesg)
    )

    if(findId == '' || findId == null || findId == undefined){

        return res.status(200).json({
            header: [{
                error:`Lo sentimos, no pudimos encontrar nada`,
                code: 201,
            }],
            body:[{}]
        })

    }

    //TODO reparar las ofetas en la busqueda de productos

    // var Offers = [];
    
    // for (let i = 0; i < findId.length; i++) {
    //     const Obj = findId[i]._id;
    //     const Offer = await Sales.find({
    //         productId: Obj.toString()
    //     })
    //     console.log(findId[i], Offer)
    //     if(Offer){
    //         for (let j = 0; j < Offer.length; j++) {
    //             if(Offer[j]){
    //                Offers.push({
    //                    'product': [
    //                       { 
    //                        name:findId[i].name,
    //                        category:findId[i].category,
    //                        price:findId[i].price,
    //                        description: findId[i].description
    //                    }
    //                    ], 
    //                    'Offers': [{
    //                        sale: Offer[j].sale,
    //                        state: Offer[j].state,
    //                    }]
    //                })
    //               }
    //           } 
    //     }else{
    //         Offers.push({
    //             'product': [
    //                 { 
    //                 name:findId[i].name,
    //                 category:findId[i].category,
    //                 price:findId[i].price,
    //                 description: findId[i].description
    //             }
    //             ], 
    //             'Offers': [{}]
    //         })
    //     }
    // }

        

    return res.status(200).json({
        header: [{
            error:`NO ERROR`,
            code: 200,
        }],
        body:[{
            products: findId,
            //Offers
            
        }]
    })

} catch (error) {
  console.log('findProductsByName error ==> '+error)
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
    obtenerTodasProductByUserID,
    obtenerProductoByIdCategory,
    obtenerProductById,
    crearProductUser,
    actualizarProductUser,
    borrarProductUser,
    findProductsByName
}