<template>
  <div class="checkbox" :class="{checked: internal_checked}" @click="checkboxClick()">
    <div class="checkbox-inner fa fa-check"></div>
  </div>
</template>

<script>
  export default {
    name: 'checkbox',
    props: {
      checked: {
        type: Boolean,
        required: true
      },
    },
    data(){
        return{
            internal_checked:false,
        }
    },
    methods:{
      checkboxClick(){
        this.internal_checked = !this.internal_checked;
        this.$emit('checkedChange', this.internal_checked);
      }
    },
    mounted(){
      this.internal_checked = this.checked;
    }
  }

</script>

<style lang="scss" scoped>
  .checkbox{
    border-radius:4px;
    border:2px solid #70C1B3;
    height:24px;
    width:24px;
    position: relative;
    cursor: pointer;
    .checkbox-inner{
      background-color: #70C1B3;
      transition:.3s ease-in-out;
      color: #FFF;
      position: absolute;
      top:0;
      left:0;
      height: 100%;
      width: 100%;
      text-align: center;
      padding-top: 3px;
      transform:scale(0);
    }
    &.checked{
      .checkbox-inner{
        transform:scale(1);
      }
    }
  }
</style>
