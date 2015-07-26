// Mozilla, Opera, Webkit 
if ( document.addEventListener ) {
  document.addEventListener( "DOMContentLoaded", function(){
    document.removeEventListener( "DOMContentLoaded", arguments.callee, false);
    documentReady();
  }, false );

// If IE event model is used
} else if ( document.attachEvent ) {
  // ensure firing before onload
  document.attachEvent("onreadystatechange", function(){
    if ( document.readyState === "complete" ) {
      document.detachEvent( "onreadystatechange", arguments.callee );
      documentReady();
    }
  });
}

// 데이터 요청
function requestData(url, xml) {

	var dataLength = 0;
	
	// ajax 요청 전 그리드에 로더 표시
	AUIGrid.showAjaxLoader(myGridID);
	
	// ajax (XMLHttpRequest) 로 그리드 데이터 요청
	ajax( {
		url : url,
		onSuccess : function(data) {
			// 그리드 데이터
			var gridData = data;
			
			dataLength =gridData.length;
			
			// 로더 제거
			//auiGrid.removeAjaxLoader();
			AUIGrid.removeAjaxLoader(myGridID);
			
			if(xml) { // XML 응답인 경우
				if(gridData.nodeType == 9)
					dataLength = gridData.documentElement.childNodes.length;
				else
					dataLength = gridData.childNodes.length;
				
				// 그리드에 XML 데이터 세팅
				AUIGrid.setXmlGridData(myGridID, gridData);
			} else {
				// 그리드에 데이터 세팅
				AUIGrid.setGridData(myGridID, gridData);
			}
		},
		onError : function(status, e) {
			alert("데이터 요청에 실패하였습니다.\r status : " + status);
		}
	});
};


