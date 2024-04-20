<template>
    <footer class="footer mt-auto py-3 ">
      <div class="container text-center">
        <span class="text-muted">
          &copy; {{ currentYear }} Ứng dụng Quản lý mượn sách
        </span>
      </div>
    </footer>
</template>
  
  <script>
  export default {
    data() {
      return {
        currentYear: new Date().getFullYear(), // Lấy năm hiện tại
      };
    }
  };
  </script>
  
  <style scoped>
  
  /* CSS tùy chỉnh cho footer */
  .footer {
    /* background: linear-gradient(to right, #5df5d1, #a9dafd,#5eb1fb); */
    background-color: #343A40;
    color: #fff; /* Màu chữ */
    text-align: center;
    border-top: 1px solid #e3e3e3; 
    transition: background-color 0.3s ease; 
    width: 100%;
   
    position: relative;
    bottom: 1px;
    border-radius: 4px; 
    font-weight: 400;
    


    
   
  }
  
  .footer:hover {
    /* background: linear-gradient(to right, #52ae98, #4986b1,#549cdc); */
    background-color: #41464a;
    color: #fff;


  }
  </style>
  