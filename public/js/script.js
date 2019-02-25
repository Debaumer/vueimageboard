(function() {
  console.log(Vue);
  new Vue({
    el: '#main',
    data: {
        heading: 'My Vue App',
        name: {
          first: '',
          last: ''
        }
    }
});
})('arg1');
