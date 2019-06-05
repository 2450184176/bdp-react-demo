    tableColumnForEach(deliveryMonCol, column => {
      const col = column;
      const { key, title } = col;
      if (fixedFields.includes(key)) col.width = 120;
      else col.width = title.length * 20 + 30;
      sumW += col.width;
    });
    if (sumW > this.tableDiv.clientWidth) {
      tableColumnForEach(deliveryMonCol, column => {
        const col = column;
        const { key } = col;
        if (fixedFields.includes(key)) col.fixed = 'left';
      });
    }
	
	export const tableColumnForEach = (tColumn = [], callback = () => {}) => {
	  tColumn.map(col => {
		const { children } = col;
		if (children) tableColumnForEach(children, callback);
		else callback(col);
		return 1;
	  });
	};