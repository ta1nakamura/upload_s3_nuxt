import Vuex from 'vuex'
const createStore =()=>{
    return new Vuex.Store({
        state:{
            // shopid:null,
            s3imageurls:[],
        },
        mutations:{

        },
        actions:{
           async uploadImage(vuexContext,{shopid, imageFile}){
               console.log('--[$sore uploadImage]',imageFile)
               if(shopid == null){
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
                    if(vuexContext.state.s3imageurls.includes(res.url)){
                        console.log('--already upload--');
                        return;
                    }
                    //[Put file to s3 ]
                    const options = {headers: {'Content-Type': imageFile.type }};
                    const res2 = await this.$axios.$put( 
                        res.signedRequest, imageFile, options);
                    
                    //Add state.s3ImageUrls[]
                    vuexContext.state.s3imageurls.push(res.url);
                    
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