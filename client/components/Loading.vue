<template>
  <div id="bitbucket_loader_wrapper" class="loading">
    <svg version="1.1" id="bitbucket_loader" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-479.2 140.2 122.4 160.6" style="enable-background:new -479.2 140.2 122.4 160.6;" xml:space="preserve">
    <g class="head-group">
      <g>
        <path class="head" d="M-418,241.4c30.1,0,49.6-11.1,50.9-18.6c2.9-16.8,10.3-59.3,10.3-62.3c-0.1-11.2-27.6-20.3-61.2-20.3l0,0l0,0
		c-33.7,0-61.2,9.1-61.2,20.3c0,3,7.3,45.4,10.3,62.3C-467.6,230.3-448.1,241.4-418,241.4L-418,241.4z M-418,166.8
		c-21.6,0-39.2-3.8-39.2-8.4c0-4.6,17.6-8.3,39.2-8.3c21.6,0,39.2,3.8,39.2,8.4C-378.9,163.1-396.4,166.8-418,166.8z" />
      </g>
    </g>
    <g class="mouth-group">
      <g>
        <path class="mouth" d="M-374.1,239.6c-0.9,0-1.7,0.7-1.7,0.7s-15,11.9-42.2,11.9c-27.2,0-42.3-11.9-42.3-11.9s-0.7-0.7-1.7-0.7
			c-1.1,0-2.2,0.7-2.2,2.4c0,0.2,0,0.3,0,0.5c2.3,12.5,4,21.4,4.3,22.7c2,9.2,20,16.2,41.7,16.2l0,0l0,0c21.7,0,39.7-6.9,41.7-16.2
			c0.3-1.4,2-10.2,4.3-22.7c0-0.2,0-0.3,0-0.5C-371.9,240.4-373,239.6-374.1,239.6z" />
      </g>
    </g>
    <g class="eye-translate" transform="translate(-418, 208.3)">
      <g>
        <circle class="eye-outter" cx="0" cy="0" r="19.4" />
        <circle class="eye-inner" cx="0" cy="0" r="9.7" />
      </g>
    </g>
</svg>
  </div>
</template>

<script scoped>
  export default {
    name: 'loading',
  }
</script>

<style scoped>
  #bitbucket_loader_wrapper {
    animation: hover 2s ease-in-out infinite;
  }

  @keyframes hover {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-6px);
    }
    100% {
      transform: translateY(0px);
    }
  }

  #bitbucket_loader {
    display: block;
    height: 10rem;
    animation: spin-wobble 4s ease infinite;
  }

  @keyframes spin-wobble {
    0% {
      transform: translateX(10px) translateY(-5px) rotateX(8deg) rotateZ(10deg);
    }
    20% {
      transform: translateX(-10px) translateY(-5px) rotateX(8deg) rotateZ(-10deg);
    }
    10%,
    30%,
    90% {
      transform: translateX(0px) translateY(0px) rotateX(0deg) rotateZ(0deg);
    }
    100% {
      transform: translateX(10px) translateY(-5px) rotateX(8deg) rotateZ(10deg);
    }
  }

  .head,
  .mouth,
  .eye-inner {
    fill: #205081;
  }

  .eye-outter {
    fill: #FFFFFF;
  }

  .mouth {
    animation: mouth-drop 2s ease;
  }

  @keyframes mouth-drop {
    0%, 60% {
      transform: translateY(-60px);
    }
    70% {
      transform: translateY(0px);
    }
    80% {
      transform: translateY(-15px);
    }
    100% {
      transform: translateY(0px);
    }
  }

  .eye-translate g {
    animation: eye-rotate 4s ease infinite;
    transform-origin: center;
    transform: rotateY(70deg) translateZ(40px) translateX(80px) translateY(-8px) rotateX(-9.5deg);
  }

  @keyframes eye-rotate {
    0% {
      transform: rotateY(75deg) translateZ(40px) translateX(55px) translateY(-10px) rotateX(-9.5deg);
    }
    20% {
      transform: rotateY(-75deg) translateZ(40px) translateX(-55px) translateY(-10px) rotateX(-9.5deg);
    }
    10%,
    30%,
    90% {
      transform: rotateY(0deg) translateZ(40px) translateX(0px) translateY(0px) rotateX(0deg);
    }
    100% {
      transform: rotateY(75deg) translateZ(40px) translateX(55px) translateY(-10px) rotateX(-9.5deg);
    }
  }
</style>
