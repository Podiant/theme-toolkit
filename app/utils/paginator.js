var paginate = function(list, number) {
    var rpp = 10;
    var firstIndex = (rpp * number) - rpp;
    var lastIndex = firstIndex + rpp;

    console.log(firstIndex, lastIndex);
    return list.slice(firstIndex, lastIndex);
};

module.exports = function(list, pageNumber) {
    if(typeof(pageNumber) == 'undefined') {
        pageNumber = 1;
    } else {
        pageNumber = parseInt(pageNumber);
    }

    var objectList = paginate(list, pageNumber);
    var pageCount = Math.round((list.length + 9) / 10);
    var self = {
        object_list: objectList,
        has_previous: pageNumber > 1,
        has_next: pageNumber < pageCount,
        previous_page_number: Math.max(1, pageNumber - 1),
        next_page_number: Math.min(pageNumber + 1, pageCount),
        number: pageNumber,
        count: list.length,
        first_object: null,
        subsequent_objects: [],
        last_object: null,
        all_but_last_object: []
    };

    self.has_next_or_previous = self.has_previous || self.has_next

    if(list.length) {
        self.first_object = objectList[0];
        self.subsequent_objects = objectList.slice(1);
        self.last_object = objectList[objectList.length - 1];
        self.all_but_last_object = objectList.slice(0, objectList.length - 1);
    }

    self.prototype = this;
    return self;
};
