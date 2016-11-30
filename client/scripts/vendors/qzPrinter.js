/**
 * Created by harry on 2015/4/11.
 */
/**
 * Optionally used to deploy multiple versions of the applet for mixed
 * environments.  Oracle uses document.write(), which puts the applet at the
 * top of the page, bumping all HTML content down.
 */
deployQZ();

/**
 * Deploys different versions of the applet depending on Java version.
 * Useful for removing warning dialogs for Java 6.  This function is optional
 * however, if used, should replace the <applet> method.  Needed to address
 * MANIFEST.MF TrustedLibrary=true discrepency between JRE6 and JRE7.
 */
function deployQZ() {
    var attributes = {id: "qz", code:'qz.PrintApplet.class',
        archive:'qz-print.jar', width:1, height:1};
    var parameters = {jnlp_href: 'qz-print_jnlp.jnlp',
        cache_option:'plugin', disable_logging:'false',
        initial_focus:'false'};
    if (deployJava.versionCheck("1.7+") == true) {}
    else if (deployJava.versionCheck("1.6+") == true) {
        delete parameters['jnlp_href'];
    }
    if(!(window.parent.window["qz"] && window.parent.window["qz"].isActive) || !window.parent.window["qz"].isActive())

        deployJava.runApplet(attributes, parameters, '1.5');
}

/**
 * Automatically gets called when applet has loaded.
 */
window.qzReady = function() {
    // Setup our global qz object
    window["qz"] = document.getElementById('qz') || window.parent.window["qz"] ;
}

/**
 * Returns whether or not the applet is not ready to print.
 * Displays an alert if not ready.
 */
function notReady() {
    // If applet is not loaded, display an error
    if (!isLoaded()) {
        return true;
    }
    // If a printer hasn't been selected, display a message.
    else if (!qz.getPrinter()) {
        //alert('Please select a printer first by using the "Detect Printer" button.');
        return true;
    }
    return false;
}

/**
 * Returns is the applet is not loaded properly
 */
function isLoaded() {
    if (!qz) {
        //alert('Error:\n\n\tPrint plugin is NOT loaded!');
        return false;
    } else {
        try {
            if (!qz.isActive()) {
                //alert('Error:\n\n\tPrint plugin is loaded but NOT active!');
                return false;
            }
        } catch (err) {
            //alert('Error:\n\n\tPrint plugin is NOT loaded properly!');
            return false;
        }
    }
    return true;
}

/***************************************************************************
 * Prototype function for finding the closest match to a printer name.
 * Usage:
 *    qz.findPrinter('zebra');
 *    window['qzDoneFinding'] = function() { alert(qz.getPrinter()); };
 ***************************************************************************/
function findPrinter(name,callBack,errorCallBack) {
    if (isLoaded()) {
        //this is a bug, see https://github.com/qzindustries/qz-print/issues/21
        var printer_name = name;
        if (name.indexOf("\E") != -1) {
            printer_name = name.replace(/\\E/, "\\E\\\\E\\Q");
        }
        qz.findPrinter(printer_name);
        window['qzDoneFinding'] = function() {
            var printer = qz.getPrinter();
            if(printer !== null)
                callBack(printer);
            else
                errorCallBack('找不到指定的打印機('+name+')');
            window['qzDoneFinding'] = null;
        };
    }else{
        errorCallBack('打印模塊未加載完或加載未成功');
    }
}

/***************************************************************************
 * Prototype function for listing all printers attached to the system
 * Usage:
 *    qz.findPrinter('\\{dummy_text\\}');
 *    window['qzDoneFinding'] = function() { alert(qz.getPrinters()); };
 ***************************************************************************/
function findPrinters(callBack,errorCallBack) {
    if (isLoaded()) {
        // Searches for a locally installed printer with a bogus name
        qz.findPrinter('\\{bogus_printer\\}');

        // Automatically gets called when "qz.findPrinter()" is finished.
        window['qzDoneFinding'] = function() {
            // Get the CSV listing of attached printers
            var printers = qz.getPrinters().split(',');
            callBack(printers);
            // Remove reference to this function
            window['qzDoneFinding'] = null;
        };
    }else{
        errorCallBack('打印模塊未加載完或加載未成功');
    }
}

/***************************************************************************
 * Prototype function for printing a PDF to a PostScript capable printer.
 * Not to be used in combination with raw printers.
 * Usage:
 *    qz.appendPDF('/path/to/sample.pdf');
 *    window['qzDoneAppending'] = function() { qz.printPS(); };
 ***************************************************************************/
function printPDF(link,is_landscape,callBack,errorCallBack) {
    if (notReady()) { errorCallBack('打印模塊未加載完或加載未成功'); return; }
    //qz.setPaperSize("8.5in", "11.0in");
    //qz.setOrientation("landscape");
    if(is_landscape === true){
        qz.setPaperSize("8.5in", "12.0in");
        qz.setOrientation("landscape");
    }else{
        qz.setOrientation("portrait");
    }
    //qz.setAutoSize(true);
    qz.appendPDF(link);
    window['qzDoneAppending'] = function() {
        qz.printPS();
        window['qzDoneAppending'] = null;
    };
    window['qzDonePrinting'] = function() {
        if (qz.getException()) {
            //console.log(qz.getException());
            errorCallBack('打印錯誤:' + qz.getException().getLocalizedMessage());
            qz.clearException();
            return;
        }else{
            callBack();
            //alert('Successfully sent print data to "' + qz.getPrinter() + '" queue.');
        }
        window['qzDonePrinting'] = null;
    }
}