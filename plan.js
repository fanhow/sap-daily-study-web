window.STUDY_PLAN=[{date:'2026-09-13',label:'規則＋SLD',subtitle:'先建立工作邊界，再用英文說清楚理由。',notice:'今天安排 2.5 小時。先讀對應摘要，再回原頁核對；各段之間可休息 5–10 分鐘（休息另計）。',tasks:[
{id:'d13-diagnostic',title:'先做 Q1–2 診斷',minutes:15,reading:'11_Mock_Assessment.md · Q1–2',steps:['今天只做 Q1–Q2，共 15 分鐘；文件開頭的 50 分鐘是全部 12 題。','先只讀問題，用中文寫關鍵理由，再依每題 English prompt 說 30–45 秒；先不看下方參考判讀。','標記不確定處，再用下方來源對照查原頁；保留第一次答案與查頁後修正。'],done:'留下兩題原始答案，標記能獨立回答／查頁後理解／仍需補強。',source:'11_Mock_Assessment.md'},
{id:'d13-rules',title:'釐清角色與安全原則',minutes:45,reading:'ESR 印刷 p6–19 · Textbook PDF p5–25',steps:['先讀 ESR 前半、Textbook Part 1 對應摘要。','回原頁整理角色責任、主要危害及安全規則的目的。','做一張角色表，區分授權、責任與工作範圍。'],done:'能不用筆記說明誰負責什麼，並留下角色表。',source:'06_ESR_Study_Part1.md；12_Textbook_Study_Part1.md'},
{id:'d13-sld',title:'讀懂 SLD，標出工作界線',minutes:60,reading:'Burn Hall PDF p1–3 · Exercises PDF p42–44',steps:['30 分鐘：讀 Burn Hall p1–3，畫出 DNO、ISS、DSS A–F、供電路徑及 normal open point。','20 分鐘：先讀 Exercises p42–43 題幹與交付要求，再看 p44 SLD，標出本題 end-box investigation 的工作點與 faulted section。','10 分鐘：列至少 3 項 assumptions／待確認資訊，與題設已知資料分開。兩份圖面屬不同情境；暫時避開 p46–51 手寫範例。'],done:'留下兩份分開的圖面標註及未知資訊清單；能區分 investigation、repair 與 diversion。',source:'16_SLD_Equipment_Forms_Study.md；15_Exercises_Study.md'},
{id:'d13-english',title:'用英文說明你的判斷',minutes:30,reading:'今天的角色表與 SLD 標註',steps:['選一張圖，用英文說明工作目的、equipment identity、sources 和 boundary。','以 60–90 秒回答一次，再回筆記核對。','重說一次，說清 why，以及需要誰確認哪些資訊。'],done:'完成至少兩次口述，記下一個英文表達或推理問題。',source:'04_Study_Plan.md'}]}];

// Estimates are focused study minutes. Course assignments are not timed in advance.
(()=>{
const T=(id,title,minutes,reading,steps,done,source,extra={})=>({id,title,minutes,reading,steps,done,source,...extra});
const P1='12_Textbook_Study_Part1.md',P2='13_Textbook_Study_Part2.md',P3='14_Textbook_Study_Part3.md',E1='06_ESR_Study_Part1.md',E2='06_ESR_Study_Part2.md',EX='15_Exercises_Study.md',SLD='16_SLD_Equipment_Forms_Study.md',MOCK='11_Mock_Assessment.md',JOIN='20_Joining_Checklist.md';
window.STUDY_PLAN.push(
{date:'2026-09-14',label:'設備＋Transformers',subtitle:'把設備功能、限制與資料表連在一起。',notice:'180 分鐘包含 30 分鐘英文回憶。並聯變壓器計算先看公式核對筆記，不照抄 Textbook p67 的疑點公式。',tasks:[
T('d14-switchgear','比較四種 switchgear',30,'Textbook PDF p26–44、54–55',['先讀對應摘要，再回圖面核對 CB、switch、disconnector、earth switch。','分清 making、breaking 與 short-time withstand 能力。'],'完成四種設備的功能／限制比較表。',P1),
T('d14-interlock','滅弧、機構與 interlock',30,'Textbook PDF p29–30、35–43、45–54',['分開整理絕緣介質與滅弧介質。','用 3 個教材例子說明 interlock 防止什麼危害，並標示需核對的設備條件。'],'能解釋 3 個 interlock 的目的，並留下比較筆記。',P1),
T('d14-transformer','建立 transformer 概念圖',30,'Textbook PDF p56–67 · 公式核對筆記',['概念圖包含 ratio、vector group、kVA、%Z、cooling。','查看並聯公式核對的假設與自訂例題，標出原 p67 公式疑點。'],'留下概念圖，能說明各參數意義與計算假設。',P1+'；'+P2+'；18_Transformer_Formula_Crosscheck.md'),
T('d14-oil','Oil 與 maintenance 原理',15,'Textbook PDF p68–77',['列出 oil 的功能與 3 種 condition 資料。','區分教材例子與設備實際適用資料，不把歷史參數背成通用設定。'],'留下 oil 功能與 condition 資料清單。',P2),
T('d14-equipment','核對兩份 DSS 設備資料',45,'Burn Hall PDF p4–12 · 設備照片筆記',['先瀏覽 p4–12，再聚焦 DSS B（p8）與 DSS C（p9）。','對照 SLD、設備資料及影像筆記；空白與不確定欄保留未知。'],'完成兩份 equipment sheets 比較，標出待確認欄位。',SLD+'；08_Equipment_Photo_Study.md'),
T('d14-recall','五題英文閉書回憶',30,'Textbook PDF p166–172 · 選 5 題',['每題先用英文說 60–90 秒，再回來源核對。','選最卡的一題修正並重說。'],'完成 5 題口述與至少一項修正紀錄。',P3)]},
{date:'2026-09-15',label:'Isolation＋安全文件',subtitle:'每個安全安排都要有目的、理由與證據。',notice:'今天用同一情境練習 I&E 與文件選擇。先寫自己的答案，再看研究筆記中的參考判讀。',tasks:[
T('d15-boundary','安全安排與工作界線',45,'Textbook PDF p119–124 · ESR 印刷 p21–27',['整理能源來源與工作邊界。','比較 CME／additional earth 的用途，列出需要核對的證據。'],'留下工作邊界、接地用途及證據需求表。',P2+'；'+E1),
T('d15-reasons','說明隔離、驗電與接地的理由',15,'ESR 印刷 p24–27',['在同一課堂情境中，分開解釋 isolate、prove dead、earth。','每一項都寫目的、所需證據及尚待確認資訊。'],'三項各有理由及證據需求，不只列操作動詞。',E1),
T('d15-docs','比較 PTW／SFT／LOA',40,'ESR 印刷 p31–36、52–57',['閱讀三份文件的用途、責任及適用限制。','做一張用途／發出與接收責任／生命週期表。'],'能說明為何選某份文件，以及其適用邊界。',E1+'；'+E2),
T('d15-forms','逐欄看安全表單',20,'Safety Documents PDF p1–2、5–6 · ESR 印刷 p52–57',['標出 Issue／Receipt／Clearance／Cancellation。','看 PTW 與 SFT 接地欄的差異；用 ESR 補看完整正反面及 LOA。'],'留下欄位標註，能指出 PTW 與 SFT 接地欄差異。',SLD+'；'+E2),
T('d15-choice','文件選擇練習 Q3–Q7',40,'11_Mock_Assessment.md · Q3–Q7',['先獨立回答，再看參考判讀。','每題寫選擇理由及缺少哪些資訊。'],'五題均有自己的判斷、理由與待確認事項。',MOCK),
T('d15-ie','I&E 草圖與英文說明',20,'Safety Documents PDF p2 · 同一題 SLD',['以同一設備身份和工作範圍畫 I&E 草圖。','每項安排附一句理由，另列待確認資訊；用英文說明。'],'草圖與題目一致，每項安排均有理由。',SLD)]},
{date:'2026-09-16',label:'Switching＋紀錄',subtitle:'讓 scope、設備、文件編號與時間互相對得上。',notice:'教材有編號與設備描述不一致處。把矛盾列成具體問題，不自行猜哪一份才是正確版本。',tasks:[
T('d16-rules','計畫、覆核與紀錄規則',45,'ESR 印刷 p29–31、37–41、58–61 · Safety Documents PDF p2–4、7',['區分計畫中的安排、指示、實際觀察與已確認結果。','整理覆核責任、實際事件欄及文件交叉參照。'],'留下計畫欄／事件欄／責任／參照核對表。',E1+'；'+E2+'；'+SLD),
T('d16-case','跟完整個 cable-diversion 案例',60,'Textbook PDF p141–165',['讀題目 p150–151；追工作文件 p152–157、測試文件 p158–163、關閉紀錄 p164–165。','畫 scope→I&E／schedule→PTW→SFT→紀錄的文件生命週期。','標出各階段的責任與狀態變化。'],'完成同一案例的生命週期圖，能指出每一份文件何時使用。',P3),
T('d16-review','Cross-document review',30,'Textbook PDF p141–165 · 教材疑點清單',['核對 scope、equipment、編號、日期／時間與狀態。','可比較 p153–154 schedule 267487 與 p159 entry 1 的 26747，回原頁確認。','針對不一致寫下需向講師釐清的資料。'],'至少留下一組矛盾、兩側頁碼及具體提問。',P3+'；19_Errata_and_Trainer_Questions.md'),
T('d16-english','英文解釋文件矛盾',15,'11_Mock_Assessment.md · Q8',['先回答 Q8，再用英文解釋不一致可能造成的問題。','說明需要確認什麼資訊，修正後再說一次。'],'完成口述並留下修正紀錄。',MOCK)]},
{date:'2026-09-17',label:'Protection＋Cables',subtitle:'從保護作用鏈，走到辨識、測試與交接。',notice:'教材中的歷史 cable-testing 資料只用來理解原理，不能當成現場通用測試電壓、時間或判準。',tasks:[
T('d17-protection','畫出保護作用鏈',40,'Textbook PDF p92–110',['畫 CT→relay→trip circuit→CB。','比較 OC／EF，整理 HRC／TLF／IDMT／Buchholz 的作用。'],'完成作用鏈與保護比較表，能口述一個故障如何觸發跳脫。',P2),
T('d17-idmt','PSM／TMS 學習計算',20,'Textbook PDF p180–182',['選一題，列額定值、同側單位與所有假設後計算。','區分 relay operating time 與最終斷路器跳脫時間。'],'完成一題有過程、單位、假設的計算。',P3),
T('d17-identify','Cable 與身分證據',40,'Textbook PDF p86–91、125–136',['先看 Part 2／3 摘要，再回原頁看識別案例。','比較 location、positive identification、proving dead 各能證明什麼與誤判來源。'],'完成三者的證據／限制比較表。',P2+'；'+P3),
T('d17-testing','整理 testing basis',20,'Textbook PDF p137–140',['列出測試目的、材料／年齡、方法、適用版本、判準及測後狀態。','標示哪些教材資料屬歷史例子，哪些需現場文件確認。'],'完成測試依據清單並保留未知資料。',P3),
T('d17-scopes','比較三種工作範圍',30,'Exercises PDF p23–25、42–44 · Textbook PDF p150–151',['分別讀 cable repair、diversion、end-box investigation 題幹。','比較三者的工作界線及交付要求，不把工作內容混用。'],'留下 repair／diversion／investigation 比較表。',EX+'；'+P3),
T('d17-recall','五題回憶與交接整理',30,'Textbook PDF p173–179 · 選 5 題',['每題先用英文說 60–90 秒，再核對來源。','完成 work→test→handover 表，記錄錯題。'],'完成 5 題口述、交接表及修正紀錄。',P3)]},
{date:'2026-09-18',label:'RA＋診斷改錯',subtitle:'把「看過」變成能獨立回答，再集中補強。',notice:'RA 覆核以指出依據、空白與矛盾為主。保留原稿數值，不替原件改分數。',tasks:[
T('d18-ra','覆核 RA15 七頁',40,'RA15 印刷 p1–7 · 07_RA_Study.md',['核對 hazard、control、責任人、評分及空白欄。','可檢查 p3 COSHH 的 2/2/2 與 p6 DR=L×S，以及 p2–3 Fire 殘餘欄。','把訓練情境與實際工作需要補的資料分開。'],'完成 RA 覆核表，列出矛盾及需要的理由／資料。','07_RA_Study.md'),
T('d18-audit','應變、audit 與器具',30,'ESR 印刷 p44–48、65–66',['回來源整理應變、audit、工具或非電氣危害資訊。','選 3 個重點，寫出各自的確認責任。'],'留下 3 項重點與確認責任。',E2),
T('d18-diagnostic','獨立完成 12 題診斷',50,'11_Mock_Assessment.md · Q1–Q12',['每題先留下自己的答案，再看參考判讀。','標成能獨立回答／查頁後理解／仍需補強。'],'12 題都有答案與理解等級。',MOCK),
T('d18-redo','分類錯誤並重答',30,'診斷答案 · 對應來源頁',['將錯誤按概念／文件／證據／英文分類。','選 3 個補強點，回原頁核對後重答。'],'留下 3 組「原錯誤 → 依據 → 重答」紀錄。',MOCK+'；04_Study_Plan.md')]},
{date:'2026-09-19',label:'完整 Mock',subtitle:'用連續時段驗證獨立作答與文件一致性。',notice:'120 分鐘及可用 ESR／course notes 是這份教材 mock 的題內設定。當班正式 assessment 的時限、允用資料及評分規則，仍以講師確認為準。',tasks:[
T('d19-mock','連續 120 分鐘獨立 Mock',120,'Exercises PDF p40–44 · 先避開 p46–51',['設定 120 分鐘，獨立作答並記錄實際用時與未完成項。','按題幹完成 site log、switching schedule、I&E、PTW Parts 1／2、assumptions。','本題是 cable end box internal investigation；按題目範圍作答，不自行加入修復與修復後復電。'],'留下題目要求的文件與計時紀錄。分段完成時先不要勾選；完成連續 120 分鐘驗證後才勾選。',EX),
T('d19-review','Review 並重做核心錯誤',60,'15_Exercises_Study.md · 作答後才看 Exercises p46–51',['核對 scope、設備、文件參照、時間與證據是否一致。','再比較手寫範例；紅筆不是已核實的 official answer key。','選 3 個核心錯誤，回原頁後重做相關部分。'],'留下 3 個錯誤及重做結果，並標出仍待講師確認處。',EX+'；19_Errata_and_Trainer_Questions.md')]},
{date:'2026-09-20',label:'緩衝＋報到準備',subtitle:'不開新章節，留時間休息與適應行程。',timeLabel:'30 分鐘',notice:'今天選做 30 分鐘，不計入 19.5 小時核心進度。旅程日期未提供；若較早出發，把完整 mock 前移到有連續 3 小時的時段。',tasks:[
T('d20-enrol','確認 enrolment 與 QR code',4,'20_Joining_Checklist.md · Online enrolment',['確認是否完成 enrolment，並把收到的 QR code 保存到可離線查看的位置。','若事前連結無法使用，個別 joining email 說明可到 training centre 辦理。'],'已完成 enrolment 並保存 QR；如仍待辦，維持未勾選並在回顧記錄安排。',JOIN,{link:{url:'https://precourse.safetyservice.net/checkin/validate',label:'開啟 online enrolment'}}),
T('d20-id','準備政府核發 ID',2,'20_Joining_Checklist.md · 身分證明',['確認護照或其他符合要求的政府 ID 已準備。'],'已將要攜帶的 ID 放入行李／隨身物品。',JOIN),
T('d20-ppe','確認 PPE 安排',3,'20_Joining_Checklist.md · Technical-training PPE',['頁面說明有 spare PPE，也可自帶。','未列確定品項／規格；若自帶，依 Swindon 確認的安排準備。'],'已確認本次 PPE 取得方式；需釐清的自帶要求已有安排。',JOIN),
T('d20-fitness','確認 fitness declaration',3,'20_Joining_Checklist.md · Fitness declaration',['依 provider 流程確認聲明是否已辦理，不假定 enrolment 自動代辦。','如有適用的特殊需求，確認已依要求提前聯絡。此處只記完成狀態，不填健康細節。'],'已依 provider 要求完成聲明與適用的提前確認。',JOIN),
T('d20-arrival','核對開始時間與地點',3,'個別 joining 資料 · 20_Joining_Checklist.md',['9/21 08:30 開始；9/25 約 13:00 結束。','地點：Unit 3 Richmond House, Edison Park, Hindle Way, Swindon SN3 3RB。'],'已記下時間與地址，並核對自己的交通安排。',JOIN),
T('d20-review','只複習三張錯誤卡',15,'9/18、9/19 的錯誤與重做紀錄',['選 3 項最需要記住的修正。','用英文再說一次最弱主題；不排新章節。'],'三項均已回想，留下最後一個要問講師的問題。','04_Study_Plan.md')]}
);
const course=[['21','Rules／HV equipment'],['22','Distribution／protection／HV working／diversion'],['23','Practical／classroom exercises'],['24','Practical／classroom exercises'],['25','Technical／distribution assessments']];
for(const [day,topic] of course){const date='2026-09-'+day;window.STUDY_PLAN.push({date,label:day==='25'?'課程 Day 5 · 回饋':`課程 Day ${Number(day)-20}`,subtitle:'教材預覽：'+topic,timeLabel:day==='25'?'20–30 分':'課後 20–30 分',notice:'以上主題依 CourseOverview PDF p1 預覽，實際順序與作業以本班講師為準。指定作業時間另計；不加入課前核心進度。'+(day==='21'?' 個別 joining 資料：今天 08:30 開始。':day==='25'?' 個別 joining 資料：今天約 13:00 結束。':''),tasks:[
...(day==='21'?[T('d21-brief','完成報到並確認本班要求',null,'個別 joining 資料 · 講師當班說明',['完成報到，核對教材與表單版次。','確認正式 assessment brief、時限、允用資料與要求。'],'報到完成；當班確認結果已記在回顧。',JOIN+'；'+SLD)]:[]),
T('d'+day+'-course',day==='25'?'依正式 brief 完成 assessment':'完成講師指定練習／晚間作業',null,'當班講師指定內容',['先在今日回顧記下實際指定的教材頁碼與作業。',day==='25'?'按講師正式 brief 參與評核，記錄結果待確認或已收到的回饋。':'優先完成講師指定作業，再做下方簡短回顧。'],day==='25'?'已完成參與並記錄後續事項；此勾選不代表通過。':'已完成當天實際指定內容；若沒有作業，註記「講師未指派」後再勾選。',SLD+'；04_Study_Plan.md'),
T('d'+day+'-reflection',day==='25'?'記錄回饋與後續練習':'整理今天的一個錯誤與一個問題',25,'今日課堂筆記與講師回饋',['記下今天一個錯誤，及講師確認的用詞或版本。',day==='25'?'整理後續補強與仍未確認事項。':'留下明天要問的一個具體問題。'],'回顧包含錯誤、講師確認結果及下一步。','04_Study_Plan.md')
]});}
})();
