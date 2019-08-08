<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitc382c5d5214b6c197e2f8fea19a4a456
{
    public static $prefixLengthsPsr4 = array (
        'P' => 
        array (
            'PHPMailer\\PHPMailer\\' => 20,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'PHPMailer\\PHPMailer\\' => 
        array (
            0 => __DIR__ . '/..' . '/phpmailer/phpmailer/src',
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitc382c5d5214b6c197e2f8fea19a4a456::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitc382c5d5214b6c197e2f8fea19a4a456::$prefixDirsPsr4;

        }, null, ClassLoader::class);
    }
}
