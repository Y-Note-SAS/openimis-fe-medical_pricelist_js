export  const formatGraphQLFilters = (filters) => {
    const formattedFilters = [];

    Object.keys(filters).forEach(key => {
      const filterObj = filters[key];
      if (filterObj && filterObj.filter) {
        // Ajoute directement la chaîne filter au tableau
        formattedFilters.push(filterObj.filter);
      }
    });

    formattedFilters.push('first: 10');

    return formattedFilters;
  };

