<template>
<div id="app">
<v-toolbar dark color="primary">
    <v-toolbar-side-icon to='/'></v-toolbar-side-icon>
    <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="dialog = !dialog">
        <v-icon>link</v-icon>
    </v-btn>
</v-toolbar>
<v-content>
<v-container fluid>
<!-- ****start******** -->
    <v-layout row wrap align-center  justify-center class="text-xs-center" >
        <!-- [sample xs12] -->
        <v-flex v-for="i in 12" :key="`1${i}`" xs1>
            <v-card dark color="glay">
            <v-card-text class="px-0">{{i}}</v-card-text>
            </v-card>
        </v-flex>
        <v-flex xs10 class="text-xs-center text-sm-center text-md-center text-lg-center">
            <h1>shop:{{$route.params.shopid}}</h1>
            <!-- image -->
            <img :src="imageUrl" height="150" v-if="imageUrl"/>
            <v-text-field label="Select Image" @click='pickFile' v-model='imageName' prepend-icon='attach_file'></v-text-field>
            <input
                type="file"
                style="display:none"
                ref="image"
                accept="image/*"
                @change="onFilePicked">
            
            <v-layout row wrap justify-center>
                <v-flex xs3>
                    <!-- select image name -->
                    <v-select xs5 
                    :items="s3imageNames" v-model="selectedImagename" 
                    outline lavel="image"></v-select>
                </v-flex>
                <v-flex xs3>
                    <!-- upload button-->
                    <v-btn color="secondary" @click="onUpload">upload</v-btn>
                </v-flex>
            </v-layout>
            <v-divider></v-divider>
        </v-flex>
            
    </v-layout>

    <!-- uploadedImage -->
    <v-layout row wrap align-center  justify-center class="text-xs-center" >  
        <v-flex xs10 class="text-xs-center text-sm-center text-md-center text-lg-center">
            <h1>uploaded images</h1>
            <v-layout row wrap align-center  justify-center class="text-xs-center" >  
            <template v-for =" (item) in s3imageNames" >
                <v-flex xs3 :key="item.id">
                    <v-card>
                    <v-card-media
                        :src="'https://n2-fileuploadtest.s3.amazonaws.com/'+$route.params.shopid+'/'+item
                            + '?' + Date.now()" 
                        height="200px"
                        ></v-card-media>
                    <v-card-title primary-title>
                        <div>
                            <h3 class="headline mb-0">{{item}}</h3>
                            <div>Located two hours south of Sydney in the <br>
                            Southern Highlands of New South Wales, ...</div>
                        </div>
                    </v-card-title>
                    <!-- <h2>{{item}}</h2>
                    <img 
                    :src="'https://n2-fileuploadtest.s3.amazonaws.com/'+$route.params.shopid+'/'+item" 
                    :alt="index" style="{width:'100px'; height:100px;}"> -->
                </v-card></v-flex>
            </template>
            </v-layout>
        </v-flex>
    </v-layout>    
    
    <!-- dialog -->
    <v-dialog v-model="dialog" max-width="290">
        <v-card>
            <v-card-title class="headline">Hello World!</v-card-title>
            <v-card-text>Image Upload Script in VUE JS
                <hr>example.com
                <br>http://example.com</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" flat="flat" @click.native="dialog = false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
<!-- *********End************* -->
</v-container>
</v-content>
</div>
</template>
<script>
export default {
    data:function(){
        return {
            title: "Image Upload",
            dialog: false,
            imageName: '',
            imageUrl: '',
            imageFile: '',
            // s3imageurls:[],
            s3imageNames:['avater_img','shop_img_01','shop_img_02','shop_img_03'],
            selectedImagename: 'avater_img',
        }
    },
    validate ({ params }) {
        // 数値でなければならない
        // return /^\d+$/.test(params.shopid)
        const shopids =['001','002']
        let result = shopids.includes(params.shopid)
        return result;
    },
    methods: {
        pickFile () {
            this.$refs.image.click ()
        },
		
		onFilePicked (e) {
			const files = e.target.files
			if(files[0] !== undefined) {
				this.imageName = files[0].name
				if(this.imageName.lastIndexOf('.') <= 0) {
					return
				}
				const fr = new FileReader ()
				fr.readAsDataURL(files[0])
				fr.addEventListener('load', () => {
					this.imageUrl = fr.result
                    this.imageFile = files[0] // this is an image file that can be sent to server...
				})
			} else {
				this.imageName = ''
				this.imageFile = ''
				this.imageUrl = ''
			}
        },
        onUpload(){
            if(this.imageFile == ''){
                return;
            }
            //changename
            
            this.$store.dispatch('uploadImage', { 
                shopid: this.$route.params.shopid ,
                imageFile: this.imageFile, 
                s3filename: this.selectedImagename, //filename from v-select
            }).then(()=>{
                setTimeout(()=>{
                    // this.s3imageurls = this.$store.state.s3imageurls;
                    // vue.$forceUpdate();
                    this.$forceUpdate();
                },3000)
            })
        },
    },

}
</script>
