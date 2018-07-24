<template>
<div id="app">
    <!-- <v-app> -->
        <v-toolbar dark color="primary">
            <v-toolbar-side-icon></v-toolbar-side-icon>
            <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog = !dialog">
                <v-icon>link</v-icon>
            </v-btn>
        </v-toolbar>
		<v-content>
			<v-container fluid>
				<v-flex xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
                    <!-- image -->
					<img :src="imageUrl" height="150" v-if="imageUrl"/>
					<v-text-field label="Select Image" @click='pickFile' v-model='imageName' prepend-icon='attach_file'></v-text-field>
					<input
						type="file"
						style="display:none"
						ref="image"
						accept="image/*"
						@change="onFilePicked"
					>
                    <!-- upload -->
                    <v-btn color="secondary" @click="onUpload">upload</v-btn>
                    <!-- uploadedImage -->
                    <img :src="img2src" alt="uploadedimage">

				</v-flex>
                <!-- dialog -->
				<v-dialog v-model="dialog" max-width="290">
					<v-card>
						<v-card-title class="headline">Hello World!</v-card-title>
						<v-card-text>Image Upload Script in VUE JS
							<hr>Yubaraj Shrestha
							<br>http://yubarajshrestha.com.np/</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="green darken-1" flat="flat" @click.native="dialog = false">Close</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</v-container>
		</v-content>
    <!-- </v-app> -->
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
            uploadedImageUrl:'',  //test add
            img2src:'', //test add
        }
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
                    // console.log('--ImageUrl--',this.imageUrl)
                    // console.log('--ImageFile--',this.imageFile)
				})
			} else {
				this.imageName = ''
				this.imageFile = ''
				this.imageUrl = ''
			}
        },
        onUpload(){
            console.log('--onUpload--')
            this.loadUplodaImage;
            // console.log(this.$data)
            console.log('[this.$data.title]',this.$data.title)
            console.log('[this.title]',this.title)
            
            if(this.imageFile == ''){
                return;
            }
            console.log('[this.imageFile]',this.imageFile)
            return this.$axios.$get('/api/sign-s3',{
                params:{
                    'file-name':this.imageFile.name,
                    'file-type':this.imageFile.type
                }
            }).then(res =>{
                console.log('--res from api--',res)
                this.uploadedImageUrl = res.url;
                // upload
                const options = { 
                    headers: {'Content-Type': this.imageFile.type }
                };
                return this.$axios.$put(res.signedRequest,this.imageFile,options)
            }).then(res2=>{
                //Success Upload
                console.log('--upload success--',res2);
                //load image
                setTimeout(()=>{
                    console.log('-- auto showS3Image')
                    this.img2src = this.uploadedImageUrl
                },3000)

            }).catch(e=>{
                console.log('--error',e)
            });
        },
    }
}
</script>
