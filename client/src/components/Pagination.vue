<template>
	<div class="app-footer mt-3">
		<div class="mr-auto"></div>

		<!-- show spinner while paginating -->
		<!-- <i class="icofont-refresh fa-spin" v-if="paginateLoader"></i> -->

		<!-- <div class="d-flex align-items-center"> -->
		<!-- Show rows:
                
			start from page 1
            <select v-model="per_page" @change="loadSelectedPage(1)" data-cy="page_select" >
                <option v-for="show in showPerPage" :key="show" :value="show">{{show}}</option>
		</select>-->

		<!-- if totalData < perPage, eg: totalData: 40 and perPage: 50
            then it shows as: Showing 1 to 50 of 40 data , which is not equivalent.
		So we check the below condition to show as: Showing 1 to 40 data of 40 data-->

		<!-- {{(perPage * currentPage) - perPage + 1}} -
		{{(perPage * currentPage)}} of {{totalData}}-->
		<!-- Later on make it "totalData > 10". There won't be '< >' sign if total data is less than 11 -->
		<div v-if="totalData > 3">
			<nav aria-label="Page navigation example">
				<ul class="pagination">
					<li class="page-item mr-2">
						<a class="page-link" href="javascript:void(0);" aria-label="Previous" @click="previousPage">
							<span aria-hidden="true">&laquo;</span>
							<span class="sr-only">Previous</span>
						</a>
					</li>
					<div v-if="(totalData > perPage) && (totalPage > currentPage)">
						{{(perPage * currentPage) - perPage + 1}} -
						{{(perPage * currentPage)}} of {{totalData}}
					</div>
					<div v-else-if="totalPage <= currentPage">
						{{(perPage * currentPage) - perPage + 1}} -
						{{totalData}} of {{totalData}}
					</div>
					<div v-else>
						{{(perPage * currentPage) - perPage + 1}} -
						{{totalData}} of {{totalData}}
					</div>
					<li class="page-item ml-2">
						<a class="page-link" href="javascript:void(0);" aria-label="Next" @click="nextPage">
							<span aria-hidden="true">&raquo;</span>
							<span class="sr-only">Next</span>
						</a>
					</li>
				</ul>
			</nav>
		</div>
		<!-- </div> -->
	</div>
</template>
<script>
export default {
	props: {
		currentPage: Number,
		perPage: Number,
		totalPage: Number,
		totalData: Number,
		//    paginateLoader:{
		//        type: Boolean,
		//        required: false,
		//        default: false
		//    },
	},
	data() {
		return {
			per_page: this.perPage,
			// showPerPage: [5, 10, 25, 50 ,100]
		}
	},
	methods: {
		loadSelectedPage(pageNo = this.currentPage, perPage = this.per_page) {
			this.$emit('gotoPage', pageNo, perPage)
		},
		nextPage() {
			// console.log('nextPage', this.currentPage, this.totalPage)
			if (this.currentPage === this.totalPage) {
				this.loadSelectedPage(1)
			} else {
				this.loadSelectedPage(this.currentPage + 1)
			}
		},
		previousPage() {
			// console.log('previousPage', this.currentPage)
			if (this.currentPage === 1) {
				this.loadSelectedPage(this.totalPage)
			} else {
				this.loadSelectedPage(this.currentPage - 1)
			}
		},
	},
}
</script>

