import { ref, computed, watch } from 'vue';

export function usePagination(initialPage: number = 1, initialLimit: number = 10) {
  const page = ref(initialPage);
  const limit = ref(initialLimit);
  const total = ref(0);
  const search = ref('');

  const totalPages = computed(() => Math.ceil(total.value / limit.value));

  function setPage(newPage: number) {
    page.value = newPage;
  }

  function setLimit(newLimit: number) {
    limit.value = newLimit;
    page.value = 1;
  }

  function setSearch(newSearch: string) {
    search.value = newSearch;
    page.value = 1;
  }

  function getPaginationParams() {
    return {
      page: page.value,
      limit: limit.value,
      search: search.value || undefined,
    };
  }

  function reset() {
    page.value = 1;
    limit.value = initialLimit;
    search.value = '';
  }

  return {
    page,
    limit,
    total,
    totalPages,
    search,
    setPage,
    setLimit,
    setSearch,
    getPaginationParams,
    reset,
  };
}