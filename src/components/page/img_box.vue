<template>
  <div class="imgbox">
    <div class="wrapbox">
      <div class="quotes fl">
        <p>心态决定命运，自信走向成功。</p>
        <p>明日复明日，明日何其多，我生待明日，万事成蹉跎。</p>
        <p>但求日积月累，收货于细微；不要左顾右盼，专注于自我。</p>
      </div>
      <div class="headerpic fr">
        <a href="javascript:void(0);">
          <span>钟迪洋</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style>
  /*图片*/
  .imgbox{ /*120-27*3*/
    width: inherit;
    height: 120px;
    background: url(../../assets/images/header.jpg) repeat-x;
  }
  .imgbox .quotes{
    margin: 19px 0 0 95px;
  }
  .imgbox .quotes p{
    padding: 3px 0;
    color: #7b7575;
    text-shadow: 1px 1px #C8B2FA, 1px 1px #403D3A, 1px 1px #4b16c5, 1px 1px #9A9090;
  }
  /*头像*/
  .imgbox .headerpic a{
    display: block;
    margin: 10px 95px 10px 0;
    width: 100px;
    height: 100px;
    background: url(../../assets/images/logo.png);
    border-radius: 50%;
    border: 4px solid #ccc;
    position: relative;
    overflow: hidden;
  }
  .imgbox .headerpic a span{
    position: absolute;
    width: 100px;
    height: 32px;
    text-align: center;
    background: rgba(123, 117, 117, .6);
    line-height: 26px;
    bottom: -40px;
    transition: bottom 1s;
  }
  .imgbox .headerpic a:hover span{
    display: block;
    bottom: -4px;
  }
</style>
