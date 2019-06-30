<template>
  <div class="app-footer mt-3">
    <div class="mr-auto"></div>
    <div v-if="totalData > 3">
      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item mr-2">
            <a
              class="page-link"
              href="javascript:void(0);"
              aria-label="Previous"
              @click="previousPage"
            >
              <span aria-hidden="true">&laquo;</span>
              <span class="sr-only">Previous</span>
            </a>
          </li>
          <div v-if="totalData > perPage && totalPage > currentPage">
            {{ perPage * currentPage - perPage + 1 }} -
            {{ perPage * currentPage }} of {{ totalData }}
          </div>
          <div v-else-if="totalPage <= currentPage">
            {{ perPage * currentPage - perPage + 1 }} - {{ totalData }} of
            {{ totalData }}
          </div>
          <div v-else>
            {{ perPage * currentPage - perPage + 1 }} - {{ totalData }} of
            {{ totalData }}
          </div>
          <li class="page-item ml-2">
            <a
              class="page-link"
              href="javascript:void(0);"
              aria-label="Next"
              @click="nextPage"
            >
              <span aria-hidden="true">&raquo;</span>
              <span class="sr-only">Next</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    currentPage: Number,
    perPage: Number,
    totalPage: Number,
    totalData: Number,
  },
  data() {
    return {
      per_page: this.perPage,
    }
  },
  methods: {
    loadSelectedPage(pageNo = this.currentPage, perPage = this.per_page) {
      this.$emit('gotoPage', pageNo, perPage)
    },
    nextPage() {
      if (this.currentPage === this.totalPage) {
        this.loadSelectedPage(1)
      } else {
        this.loadSelectedPage(this.currentPage + 1)
      }
    },
    previousPage() {
      if (this.currentPage === 1) {
        this.loadSelectedPage(this.totalPage)
      } else {
        this.loadSelectedPage(this.currentPage - 1)
      }
    },
  },
}
</script>
