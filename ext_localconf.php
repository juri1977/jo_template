<?php
if (!defined('TYPO3_MODE')) {
    die('Access denied.');
}
call_user_func(function() {
    $GLOBALS['TYPO3_CONF_VARS']['LOG']['JO']['JoTemplate']['writerConfiguration'] = [
        \TYPO3\CMS\Core\Log\LogLevel::INFO => [
            // add a SyslogWriter
            'TYPO3\\CMS\\Core\\Log\\Writer\\FileWriter' => [
                // configuration for the writer
                'logFile' => 'typo3temp/logs/jotemplate.log',
            ],
        ],
    ];
});
