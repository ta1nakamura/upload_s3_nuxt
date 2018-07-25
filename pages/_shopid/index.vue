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
						@change="onFilePicked"
					>
                    <!-- upload -->
                    <v-btn color="secondary" @click="onUpload">upload</v-btn>
                    <v-divider></v-divider>
                </v-flex>
                
                <!-- uploadedImage -->
                <v-flex xs10 class="text-xs-center text-sm-center text-md-center text-lg-center">
                    <h1>uploaded images</h1>
                    <img v-for =" (item,index) in s3imageurls" :key="item.id"
                        :src="item" :alt="index" style="{width:'100px'; height:100px;}">
                </v-flex>
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
            s3imageurls:[],
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
            this.$store.dispatch('uploadImage', { 
                shopid: this.$route.params.shopid ,
                imageFile: this.imageFile})
            .then(()=>{
                setTimeout(()=>{
                    this.s3imageurls = this.$store.state.s3imageurls;
                },3000)
            })
        },
    },

}
</script>
