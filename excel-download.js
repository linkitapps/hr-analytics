// 엑셀 다운로드 라이브러리
// btechco_excelexport : https://github.com/battatech/battatech_excelexport

// 실제 동작 URL
// http://www.forest.go.kr/newkfsweb/html/HtmlPage.do?pg=/fcm/UI_FCS_121070.html&mn=KFS_02_10_12_10_70&orgId=fcm


// [구현 코드 예제]

// 차트 이미지 다운로드, 통계표 엑셀 다운로드
$('.chart-save-btn').on('click', function() {
  // 통계표
  if ($(this).hasClass('table-save-btn')) {
    var downloadBtns = [],
      downloadBtnClone = $('#excel-download-anchor').clone();

    $('.table-header').each(function(i) {
      var tableHeader = $(this),
        tableContainer = tableHeader.find('.table-container'),
        table = tableContainer.find('.dataTables_scrollBody > table'),
        filename = tableHeader.find('div.title').text() || '다운로드';

      table.attr('id', 'stattable' + i);

      // thead 의 tr 들의 height 가 0 으로 되어 있어서 아래와 같이 처리
      var trs = [];
      table.find('thead').find('tr').each(function() {
        var tr = $(this);

        tr.css('height', 'auto');
        trs.push(tr);

        tr.find('th').each(function() {
          $(this).css('height', 'auto');
          $(this).children('div').css('height', 'auto');
        });
      });

      // 익스플로러
      // http://stackoverflow.com/questions/4639372/export-to-csv-in-jquery
      // http://stackoverflow.com/questions/7405345/data-uri-scheme-and-internet-explorer-9-errors/26003382#26003382
      if (navigator.userAgent.match("Trident")) {
        var uri = table.btechco_excelexport({
          containerid: 'stattable' + i,
          datatype: $datatype.Table,
          returnUri: true
        });

        var uri = '<table>' + table.html() + '</table>';


        var iframe = $('<iframe />', {
          id: 'excel-download-iframe' + i
        });
        $('body').append(iframe);
        iframe = iframe[0];

        iframe = iframe.contentWindow || iframe.contentDocument;

        iframe.document.open("text/html", "replace");
        iframe.document.write(uri);
        iframe.document.close();
        iframe.focus();
        iframe.document.execCommand('SaveAs', true, filename + '.xls');
      } else {
        var uri = table.btechco_excelexport({
          containerid: 'stattable' + i,
          datatype: $datatype.Table,
          returnUri: true
        });

        if ($('#excel-download-anchor').children('a').length < $('.table-header').length) {
          (function(i, filename, uri) {
            var downloadBtn = downloadBtnClone.clone();
            downloadBtn.attr({
              id: 'excel-download-anchor' + i,
              download: filename + '.xls',
              href: uri,
              target: '_blank'
            }).css({
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: i,
              width: '100%',
              height: '100%'
            });

            downloadBtn.appendTo('#excel-download-anchor');

            downloadBtns.push(downloadBtn);
          })(i, filename, uri);
        }
      }

      for (var i = 0; i < trs.length; i++) {
        var tr = trs[i];

        tr.css('height', 0);
        tr.find('th').each(function() {
          $(this).css('height', 0);
          $(this).children('div').css('height', 0);
        });
      }
    });

    $.each(downloadBtns, function(i, downloadBtn) {
      downloadBtn[0].click();
      downloadBtn.remove();
    });
  }
  // 차트
  else {
    $('.tab-pane.active').find('.highcharts-container').each(function(i) {
      var chartContainer = $(this).parent();

      if (chartContainer.highcharts()) {
        (function(chartContainer, i) {
          setTimeout(function() {
            chartContainer.highcharts().exportChart();
          }, i * 1500);   // 파일 다운로드가 여러 건일 경우 약간의 시간여유를 두기 위해
        })(chartContainer, i);
      }
    });
  }
});