<template>
				<span class="input input--madoka">
					<input class="input__field input__field--madoka" id="t" type="text" v-model="internalValue" :class="{filled:internalValue && internalValue.length}" :placeholder="placeholder"/>
					<label class="input__label input__label--madoka" for="t">
						<svg class="graphic graphic--madoka" width="100%" height="100%" viewBox="0 0 404 77" preserveAspectRatio="none">
							<path d="m0,0l404,0l0,77l-404,0l0,-77z"/>
						</svg>
						<span class="input__label-content input__label-content--madoka">{{label}}</span>
					</label>
				</span>
</template>

<script>
  export default {
    name: 'custom-input',
    props: {
      value: {
        type: String,
        required: false
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
          internalValue:''
      }
    },
    mounted(){
        this.internalValue = this.value;
    },
    watch:{
      internalValue:function(){
          this.$emit('valueChanged', this.internalValue);
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

  .input__field {
    position: relative;
    display: block;
    float: right;
    padding: 0.8em;
    width: 60%;
    border: none;
    border-radius: 0;
    background: #f0f0f0;
    color: #aaa;
    font-weight: bold;
    -webkit-appearance: none;
    &:focus, &.filled {
      outline: none;
    }
  }

  .input__label {
    display: inline-block;
    float: right;
    padding: 0 1em;
    width: 40%;
    color: #70C1B3;
    font-weight: bold;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    user-select: none;
  }

  .input__label-content {
    position: relative;
    display: block;
    padding: 0.6em 0;
    width: 100%;
  }

  .graphic {
    position: absolute;
    top: 0;
    left: 0;
    fill: none;
  }

  .input__field--madoka {
    width: 100%;
    background: transparent;
    color: #70C1B3;
  }

  .input__label--madoka {
    position: absolute;
    width: 100%;
    height: 100%;
    color: #70C1B3;
    text-align: left;
    cursor: text;
  }

  .input__label-content--madoka {
    transform-origin: 0% 50%;
    transition: 0.3s ease-in-out;
  }

  .graphic--madoka {
    transform: scale3d(1, -1, 1);
    transition: stroke-dashoffset 0.3s;
    pointer-events: none;
    stroke: #70C1B3;
    stroke-width: 4px;
    stroke-dasharray: 962;
    stroke-dashoffset: 558;
  }

  .input__field--madoka:focus + .input__label--madoka,
  .filled + .input__label--madoka,
  .input--filled .input__label--madok{
    cursor: default;
    pointer-events: none;
  }

  .input__field--madoka:focus + .input__label--madoka .graphic--madoka,
  .filled + .input__label--madoka .graphic--madoka,
  .input--filled .graphic--madoka {
    stroke-dashoffset: 0;
  }

  .input__field--madoka:focus + .input__label--madoka .input__label-content--madoka,
  .filled + .input__label--madoka .input__label-content--madoka,
  .input--filled .input__label-content--madoka {
    transform: translate3d(-1em, -2.5em, 0);
    font-size:12px;
  }
</style>
