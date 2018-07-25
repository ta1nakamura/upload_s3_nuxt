import Vuex from 'vuex'
const createStore =()=>{
    return new Vuex.Store({
        state:{
            shopid:null,
            s3imageurl:null,
            // s3imagesurl:[],

        },
        mutations:{

        },
        actions:{
            test(){
                console.log('--[$store.actions.test]--')
            },
           async uploadImage(vuexContext,imageFile){
               if(vuexContext.state.shopid == null){
                    console.log('-- [error]shopid is null')
                    return
               }
               try{
                   //[Get /api/sign-s3]
                    const res = await  this.$axios.$get('/api/sign-s3',{
                        params:{
                            'file-name':shopid+'/'+imageFile.name,
                            'file-type':imageFile.type
                        }});
                    console.log('--res from api--',res)
                    vuexContext.state.s3imageurl = res.url;
                    //[Put file to s3 ]
                    const options = {headers: {'Content-Type': imageFile.type }};
                    const res2 = await this.$axios.$put( 
                        res.signedRequest, imageFile, options);
                    //Success Upload
                    console.log('--upload success--',res2);
                }catch(e){
                    console.log('--error',e)
                }
            },
        },
        getters:{

        }
    });
}

export default createStore