
// const Bot = () => {

//     const load_chatbot=()=>{
//     <script src="/static-v35/fptai/js/front.js"></script>
//     // Configs
//     let liveChatBaseUrl   = document.location.protocol + '//' + 'livechat.fpt.ai/v36/src'
//     let LiveChatSocketUrl = 'livechat.fpt.ai:443'
//     let FptAppCode        = '1f4c6a5b748342b49b11d908f20f9372'
//     let FptAppName        = 'HO TRO TRA CUU LICH SU'
//     // Define custom styles
//     let CustomStyles = {
//         // header
//         headerBackground: 'linear-gradient(86.7deg, #3353a2ff 0.85%, #31b7b7ff 98.94%)',
//         headerTextColor: '#ffffffff',
//         headerLogoEnable: false,
//         headerLogoLink: 'https://chatbot-tools.fpt.ai/livechat-builder/img/Icon-fpt-ai.png',
//         headerText: 'TRA CỨU LỊCH SỬ TỈNH TRÀ VINH',
//         // main
//         primaryColor: '#6d9ccbff',
//         secondaryColor: '#ecececff',
//         primaryTextColor: '#ffffffff',
//         secondaryTextColor: '#000000DE',
//         buttonColor: '#b4b4b4ff',
//         buttonTextColor: '#ffffffff',
//         bodyBackgroundEnable: false,
//         bodyBackgroundLink: '',
//         avatarBot: 'https://chatbot-tools.fpt.ai/livechat-builder/img/bot.png',
//         sendMessagePlaceholder: 'Nhập tin nhắn',
//         // float button
//         floatButtonLogo: 'https://chatbot-tools.fpt.ai/livechat-builder/img/Icon-fpt-ai.png',
//         floatButtonTooltip: 'FPT.AI xin chào',
//         floatButtonTooltipEnable: false,
//         // start screen
//         customerLogo: 'https://chatbot-tools.fpt.ai/livechat-builder/img/bot.png',
//         customerWelcomeText: 'Vui lòng nhập tên của bạn',
//         customerButtonText: 'Bắt đầu',
//         prefixEnable: false,
//         prefixType: 'radio',
//         prefixOptions: ["Anh","Chị"],
//         prefixPlaceholder: 'Danh xưng',
//         // custom css
//         css: ''
//     }
//     // Get bot code from url if FptAppCode is empty
//     if (!FptAppCode) {
//         let appCodeFromHash = window.location.hash.substr(1)
//         if (appCodeFromHash.length === 32) {
//             FptAppCode = appCodeFromHash
//         }
//     }
//     // Set Configs
//     let FptLiveChatConfigs = {
//         appName: FptAppName,
//         appCode: FptAppCode,
//         themes : '',
//         styles : CustomStyles
//     }
//     // Append Script
//     let FptLiveChatScript  = document.createElement('script')
//     FptLiveChatScript.id   = 'fpt_ai_livechat_script'
//     FptLiveChatScript.src  = liveChatBaseUrl + '/static/fptai-livechat.js'
//     document.body.appendChild(FptLiveChatScript)
//     // Append Stylesheet
//     let FptLiveChatStyles  = document.createElement('link')
//     FptLiveChatStyles.id   = 'fpt_ai_livechat_script'
//     FptLiveChatStyles.rel  = 'stylesheet'
//     FptLiveChatStyles.href = liveChatBaseUrl + '/static/fptai-livechat.css'
//     document.body.appendChild(FptLiveChatStyles)
//     // Init
//     FptLiveChatScript.onload = function () {
//         fpt_ai_render_chatbox(FptLiveChatConfigs, liveChatBaseUrl, LiveChatSocketUrl)
//     }
//     }
    
//     return (
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8"/>
//             <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
//             <title>Tra cứu lịch sử tỉnh Trà Vinh</title>
//             <link rel="stylesheet" href="/static-v35/vendor/node_modules/bootstrap/dist/css/bootstrap.min.css"/>
//             <link rel="stylesheet" href="/static-v35/vendor/node_modules/bootstrap-vue/dist/bootstrap-vue.css"/>
//             <link rel="stylesheet" href="/static-v35/vendor/node_modules/font-awesome/css/font-awesome.min.css"/>
//             <link rel="stylesheet" href="/static-v35/fptai/css/style.default.css" id="theme-stylesheet"/>
//             <link rel="stylesheet" href="https://livechat.fpt.ai/v36/src/static/fptai-livechat.css" id="theme-stylesheet"/>
//             <link id="new-stylesheet" rel="stylesheet"/>
//             <link rel="stylesheet" href="/static-v35/fptai/fonts/icon-ai/style.css"/>
//         </head>
//         <body>
//           <div id="fpt_ai_livechat_display_container" style="display: block;" className="fullscreen">
//             <div id="fpt_ai_livechat_container_header" style="background:linear-gradient(86.7deg, #3353a2ff 0.85%, #31b7b7ff 98.94%);color:#ffffffff">
                    
//               <div className="fpt_ai_livechat_header_name">TRA CỨU LỊCH SỬ TỈNH TRÀ VINH</div>
//               <div style="flex: 1 1 1px;"></div>
//               <button id="fpt_ai_livechat_toggle_fullscreen" className="fpt_ai_livechat_container_header_fullscreen_button">
//                   <img src="https://livechat.fpt.ai/v36/src/img/fullscreen.png" alt="full"/>
//               </button>
//               <button className="fpt_ai_livechat_container_header_close_button">
//                   <img src="https://livechat.fpt.ai/v36/src/img/close.png" alt="close"/>
//               </button>
//           </div>
        
//            <div id="fpt_ai_livechat_container_iframe">
//               <iframe id="fpt_ai_i_live_chat" name="1721474994280" style="border: none; background-color: transparent; position: absolute; bottom: 0; right: 0; width: 100%; height: 100%;" 
//                       src="https://livechat.fpt.ai/v36/src/index.html?botcode=1f4c6a5b748342b49b11d908f20f9372&amp;botname=HO%20TRO%20TRA%20CUU%20LICH%20SU&amp;sendername=&amp;scendpoint=livechat.fpt.ai%3A443&amp;time=1721474994278&amp;styles=%7B%22headerBackground%22%3A%22linear-gradient(86.7deg%2C%20%233353a2ff%200.85%25%2C%20%2331b7b7ff%2098.94%25)%22%2C%22headerTextColor%22%3A%22%23ffffffff%22%2C%22headerLogoEnable%22%3Afalse%2C%22headerLogoLink%22%3A%22https%3A%2F%2Fchatbot-tools.fpt.ai%2Flivechat-builder%2Fimg%2FIcon-fpt-ai.png%22%2C%22headerText%22%3A%22H%E1%BB%97%20tr%E1%BB%A3%20tr%E1%BB%B1c%20tuy%E1%BA%BFn%22%2C%22primaryColor%22%3A%22%236d9ccbff%22%2C%22secondaryColor%22%3A%22%23ecececff%22%2C%22primaryTextColor%22%3A%22%23ffffffff%22%2C%22secondaryTextColor%22%3A%22%23000000DE%22%2C%22buttonColor%22%3A%22%23b4b4b4ff%22%2C%22buttonTextColor%22%3A%22%23ffffffff%22%2C%22bodyBackgroundEnable%22%3Afalse%2C%22bodyBackgroundLink%22%3A%22%22%2C%22avatarBot%22%3A%22https%3A%2F%2Fchatbot-tools.fpt.ai%2Flivechat-builder%2Fimg%2Fbot.png%22%2C%22sendMessagePlaceholder%22%3A%22Nh%E1%BA%ADp%20tin%20nh%E1%BA%AFn%22%2C%22floatButtonLogo%22%3A%22https%3A%2F%2Fchatbot-tools.fpt.ai%2Flivechat-builder%2Fimg%2FIcon-fpt-ai.png%22%2C%22floatButtonTooltip%22%3A%22FPT.AI%20xin%20ch%C3%A0o%22%2C%22floatButtonTooltipEnable%22%3Afalse%2C%22customerLogo%22%3A%22https%3A%2F%2Fchatbot-tools.fpt.ai%2Flivechat-builder%2Fimg%2Fbot.png%22%2C%22customerWelcomeText%22%3A%22Vui%20l%C3%B2ng%20nh%E1%BA%ADp%20t%C3%AAn%20c%E1%BB%A7a%20b%E1%BA%A1n%22%2C%22customerButtonText%22%3A%22B%E1%BA%AFt%20%C4%91%E1%BA%A7u%22%2C%22prefixEnable%22%3Afalse%2C%22prefixType%22%3A%22radio%22%2C%22prefixOptions%22%3A%5B%22Anh%22%2C%22Ch%E1%BB%8B%22%5D%2C%22prefixPlaceholder%22%3A%22Danh%20x%C6%B0ng%22%2C%22css%22%3A%22%22%7D">
//                </iframe>
//             </div>
//             <button id="fpt_ai_livechat_toggle_fullscreen" className="fpt_ai_livechat_container_header_fullscreen_button">
//                 <img src="https://livechat.fpt.ai/v36/src/img/fullscreen.png" alt="full"/>
//               </button>
//           </div>
//           <button id="fpt_ai_livechat_button" className="fpt_ai_livechat_button_blink" style="background:#6d9ccbff">
//             <img src="https://chatbot-tools.fpt.ai/livechat-builder/img/Icon-fpt-ai.png" alt="logobutton"/>
//           </button>
          
//           {load_chatbot()}
          
//           </body>
//           </html>

//     );
// };

// export default Bot;

import React, { useEffect } from 'react';
// import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-vue/dist/bootstrap-vue.css';
// import 'font-awesome/css/font-awesome.min.css';

const Bot = () => {
  useEffect(() => {
    // Configs
    const liveChatBaseUrl = `${document.location.protocol}//livechat.fpt.ai/v36/src`;
    const LiveChatSocketUrl = 'livechat.fpt.ai:443';
    let FptAppCode = '1f4c6a5b748342b49b11d908f20f9372';
    const FptAppName = 'HO TRO TRA CUU LICH SU';

    // Define custom styles
    const CustomStyles = {
      headerBackground: 'linear-gradient(86.7deg, #3353a2ff 0.85%, #31b7b7ff 98.94%)',
      headerTextColor: '#ffffffff',
      headerLogoEnable: false,
      headerLogoLink: 'https://chatbot-tools.fpt.ai/livechat-builder/img/Icon-fpt-ai.png',
      headerText: 'TRA CỨU LỊCH SỬ TỈNH TRÀ VINH',
      primaryColor: '#6d9ccbff',
      secondaryColor: '#ecececff',
      primaryTextColor: '#ffffffff',
      secondaryTextColor: '#000000DE',
      buttonColor: '#b4b4b4ff',
      buttonTextColor: '#ffffffff',
      bodyBackgroundEnable: false,
      bodyBackgroundLink: '',
      avatarBot: 'https://chatbot-tools.fpt.ai/livechat-builder/img/bot.png',
      sendMessagePlaceholder: 'Nhập tin nhắn',
      floatButtonLogo: 'https://chatbot-tools.fpt.ai/livechat-builder/img/Icon-fpt-ai.png',
      floatButtonTooltip: 'FPT.AI xin chào',
      floatButtonTooltipEnable: false,
      customerLogo: 'https://chatbot-tools.fpt.ai/livechat-builder/img/bot.png',
      customerWelcomeText: 'Vui lòng nhập tên của bạn',
      customerButtonText: 'Bắt đầu',
      prefixEnable: false,
      prefixType: 'radio',
      prefixOptions: ["Anh", "Chị"],
      prefixPlaceholder: 'Danh xưng',
      css: ''
    };

    // Get bot code from url if FptAppCode is empty
    if (!FptAppCode) {
      const appCodeFromHash = window.location.hash.substr(1);
      if (appCodeFromHash.length === 32) {
        FptAppCode = appCodeFromHash;
      }
    }

    // Set Configs
    const FptLiveChatConfigs = {
      appName: FptAppName,
      appCode: FptAppCode,
      themes: '',
      styles: CustomStyles
    };

    // Append Script
    const FptLiveChatScript = document.createElement('script');
    FptLiveChatScript.id = 'fpt_ai_livechat_script';
    FptLiveChatScript.src = `${liveChatBaseUrl}/static/fptai-livechat.js`;
    document.body.appendChild(FptLiveChatScript);

    // Append Stylesheet
    const FptLiveChatStyles = document.createElement('link');
    FptLiveChatStyles.id = 'fpt_ai_livechat_script';
    FptLiveChatStyles.rel = 'stylesheet';
    FptLiveChatStyles.href = `${liveChatBaseUrl}/static/fptai-livechat.css`;
    document.body.appendChild(FptLiveChatStyles);

    // Init
    FptLiveChatScript.onload = () => {
      window.fpt_ai_render_chatbox(FptLiveChatConfigs, liveChatBaseUrl, LiveChatSocketUrl);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 pb-4 max-w-[992px] mx-auto">
            <h2 className="text-3xl text-center pb-4 border-b border-slate-800">Chatbot</h2>
    <div id="fpt_ai_livechat_display_container" style={{ display: 'block' }} className="fullscreen">
      <div id="fpt_ai_livechat_container_header" style={{ background: 'linear-gradient(86.7deg, #3353a2ff 0.85%, #31b7b7ff 98.94%)', color: '#ffffffff' }}>
        <div className="fpt_ai_livechat_header_name">TRA CỨU LỊCH SỬ TỈNH TRÀ VINH</div>
        <div style={{ flex: '1 1 1px' }}></div>
        <button id="fpt_ai_livechat_toggle_fullscreen" className="fpt_ai_livechat_container_header_fullscreen_button">
          <img src="https://livechat.fpt.ai/v36/src/img/fullscreen.png" alt="full" />
        </button>
        <button className="fpt_ai_livechat_container_header_close_button">
          <img src="https://livechat.fpt.ai/v36/src/img/close.png" alt="close" />
        </button>
      </div>
      <div id="fpt_ai_livechat_container_iframe">
        <iframe
          id="fpt_ai_i_live_chat"
          name="1721474994280"
          style={{ border: 'none', backgroundColor: 'transparent', position: 'absolute', bottom: 0, right: 0, width: '100%', height: '100%' }}
          src="https://livechat.fpt.ai/v36/src/index.html?botcode=1f4c6a5b748342b49b11d908f20f9372&amp;botname=HO%20TRO%20TRA%20CUU%20LICH%20SU&amp;sendername=&amp;scendpoint=livechat.fpt.ai%3A443&amp;time=1721474994278&amp;styles=%7B%22headerBackground%22%3A%22linear-gradient(86.7deg%2C%20%233353a2ff%200.85%25%2C%20%2331b7b7ff%2098.94%25)%22%2C%22headerTextColor%22%3A%22%23ffffffff%22%2C%22headerLogoEnable%22%3Afalse%2C%22headerLogoLink%22%3A%22https%3A%2F%2Fchatbot-tools.fpt.ai%2Flivechat-builder%2Fimg%2FIcon-fpt-ai.png%22%2C%22headerText%22%3A%22H%E1%BB%97%20tr%E1%BB%A3%20tr%E1%BB%B1c%20tuy%E1%BA%BFn%22%2C%22primaryColor%22%3A%226d9ccbff%22%2C%22secondaryColor%22%3A%22ecececff%22%2C%22primaryTextColor%22%3A%22%23ffffffff%22%2C%22secondaryTextColor%22%3A%22%23000000DE%22%2C%22buttonColor%22%3A%22%23b4b4b4ff%22%2C%22buttonTextColor%22%3A%22%23ffffffff%22%2C%22bodyBackgroundEnable%22%3Afalse%2C%22bodyBackgroundLink%22%3A%22%22%2C%22avatarBot%22%3A%22https%3A%2F%2Fchatbot-tools.fpt.ai%2Flivechat-builder%2Fimg%2Fbot.png%22%2C%22sendMessagePlaceholder%22%3A%22Nh%E1%BA%ADp%20tin%20nh%E1%BA%AFn%22%2C%22floatButtonLogo%22%3A%22https%3A%2F%2Fchatbot-tools.fpt.ai%2Flivechat-builder%2Fimg%2FIcon-fpt-ai.png%22%2C%22floatButtonTooltip%22%3A%22FPT.AI%20xin%20ch%C3%A0o%22%2C%22floatButtonTooltipEnable%22%3Afalse%2C%22customerLogo%22%3A%22https%3A%2F%2Fchatbot-tools.fpt.ai%2Flivechat-builder%2Fimg%2Fbot.png%22%2C%22customerWelcomeText%22%3A%22Vui%20l%C3%B2ng%20nh%E1%BA%ADp%20t%C3%AAn%20c%E1%BB%A7a%20b%E1%BA%A1n%22%2C%22customerButtonText%22%3A%22B%E1%BA%AFt%20%C4%91%E1%BA%A7u%22%2C%22prefixEnable%22%3Afalse%2C%22prefixType%22%3A%22radio%22%2C%22prefixOptions%22%3A%5B%22Anh%22%2C%22Ch%E1%BB%8B%22%5D%2C%22prefixPlaceholder%22%3A%22Danh%20x%C6%B0ng%22%2C%22css%22%3A%22%22%7D"
        ></iframe>
      </div>
      <button id="fpt_ai_livechat_toggle_fullscreen" className="fpt_ai_livechat_container_header_fullscreen_button">
        <img src="https://livechat.fpt.ai/v36/src/img/fullscreen.png" alt="full" />
      </button>
      <button id="fpt_ai_livechat_button" className="fpt_ai_livechat_button_blink" style={{ background: '#6d9ccbff' }}>
        <img src="https://chatbot-tools.fpt.ai/livechat-builder/img/Icon-fpt-ai.png" alt="logobutton" />
      </button>
    </div>
    </div>
  );
};

export default Bot;
