<template>
				<span class="input">
					<input v-if="type === 'text'" class="input-field" :id="id" type="text" v-model="internalValue" :class="{filled:internalValue && internalValue.length}" :placeholder="placeholder"/>
					<input v-if="type === 'password'" class="input-field" :id="id" type="password" v-model="internalValue" :class="{filled:internalValue && internalValue.length}" :placeholder="placeholder"/>
					<label class="input-label" :for="id">
						<span class="input-label-content">{{label}}</span>
					</label>
          <div class="bar"></div>
				</span>
</template>

<script>
  import { guid } from '../assets/utilities';
  export default {
    name: 'custom-input',
    props: {
      value: {
        type: String,
        required: false
      },
      type: {
          type:String,
          default:'text',
          required:false
      },
      label: {
          type:String,
          required:false
      },
      placeholder:{
          type:String,
          required:false
      }
    },
    data(){
      return{
          internalValue:this.value,
          id:guid()
      }
    },
    computed:{
        test(){
            console.log(this.value)
          return this.value;
        }
    },
    mounted(){
        this.internalValue = this.value;
    },
    watch:{
      internalValue:function(){
          this.$emit('valueChanged', this.internalValue);
      },
      value:function(){
        this.internalValue = this.value;
      }
    }
  }

</script>

<style lang="scss" scoped>
  .input {
    position: relative;
    z-index: 1;
    margin:1em 0;
    display: inline-block;
    max-width: 350px;
    width: calc(100% - 2em);
    vertical-align: top;
  }

  .input-field {
    position: relative;
    display: block;
    padding: 0.8em 0.8em 0.8em .4em;
    border: none;
    border-radius: 0;
    font-weight: bold;
    -webkit-appearance: none;
    width: 100%;
    background: transparent;
    color: #666;
    &:focus, &.filled {
      outline: none;
    }
    &:focus{
      ~ .bar{
        &::before{
          width:50%;
          left:0;
        }
        &::after{
          width:50%;
        }
      }
    }
  }

  .input-label {
    position: absolute;
    top:0;
    left:0;
    padding: 0 1em;
    font-weight: bold;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    user-select: none;
    width: 100%;
    height: 100%;
    color: #70C1B3;
    text-align: left;
    cursor: text;
  }
  .bar{
    height:1px;
    width:100%;
    border-bottom:1px solid #CCC;
    position: relative;
    &::before{
      content: '';
      height:3px;
      width:0;
      left:50%;
      position: absolute;
      background: #70C1B3;
      transition:.25s ease-in-out;
    }
    &::after{
      content: '';
      height: 3px;
      width: 0;
      background: #70C1B3;
      position: absolute;
      left: 50%;
      transition:.25s ease-in-out;
    }
  }

  .input-label-content {
    transform-origin: 0% 50%;
    transition: 0.25s cubic-bezier(0.68, -0.55, 0.257, 1.55);
    position: relative;
    display: block;
    padding: 0.6em 0;
    width: 100%;
  }

  .input-field:focus + .input-label,
  .filled + .input-label,
  .input--filled .input-label{
    cursor: default;
    pointer-events: none;
  }

  .input-field:focus + .input-label .input-label-content,
  .filled + .input-label .input-label-content,
  .input--filled .input-label-content {
    transform: translate3d(-1em, -1.5em, 0);
    font-size:12px;
  }
</style>
