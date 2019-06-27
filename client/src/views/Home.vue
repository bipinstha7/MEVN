<template>
	<div class="container">
		<div class="col-lg-12 ccol-md-12 col-sm-12">
			<label>
				File
				<input type="file" id="file" ref="file" v-on:change="handleFileUpload()">
			</label>
			<button v-on:click="submitFile()">Submit</button>
		</div>
		<router-link to="/employees">Employees Table</router-link>
		<div class="alert alert-success" role="alert" v-if="importedDataLength">
			<button type="button" class="close" data-dismiss="alert" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
			<strong>Success!</strong>
			{{importedDataLength}} employees data are imported!
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			csvData: '',
			importedDataLength: null,
		}
	},
	methods: {
		submitFile() {
			const formData = new FormData()

			/*
            Add the form data we need to submit
        */
			formData.append('file', this.csvData)
			console.log('formData', formData)
			/*
          Make the request to the POST /single-file URL
        */
			this.axios
				.post(`${this.BASE_URL}/employees/import-csv`, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				})
				.then(res => {
					console.log('SUCCESS!!', res)
					this.importedDataLength = res.data.totalCreated
				})
				.catch(err => {
					console.log('err', err)
				})
		},

		/*
        Handles a change on the file upload
      */
		handleFileUpload() {
			// this.csvData = this.$refs.file.files[0]
			const file = this.$refs.file.files[0]

			const fileReader = new FileReader()
			fileReader.addEventListener('load', () => {
				this.imageUrl = fileReader.result
			})
			fileReader.readAsDataURL(file)
			this.csvData = file
			console.log('ccccccccccc', this.csvData)
		},
	},
}
</script>