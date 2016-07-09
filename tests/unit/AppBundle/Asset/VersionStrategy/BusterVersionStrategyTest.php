<?php
namespace Tests\Unit\AppBundle\Asset\VersionStrategy;

use AppBundle\Asset\VersionStrategy\BusterVersionStrategy;
use Codeception\Test\Unit;
use org\bovigo\vfs\vfsStream;
use org\bovigo\vfs\vfsStreamDirectory;
use org\bovigo\vfs\vfsStreamWrapper;

class BusterVersionStrategyTest extends Unit
{
    public function _before()
    {
        vfsStream::setup('web', null, [
            'busters.json' => '{"vfs://web/css/app.css": "styles-cache-key", "vfs://web/js/app.js": "scripts-cache-key"}',
            'css' => ['app.css' => ''],
            'js' => ['app.js' => ''],
        ]);
    }

    public function getVersionProvider()
    {
        return [
            [
                'incorrectManifestPath' => null,
                'correctFormat' => '%s?%s',
                'correctAssetPath' => vfsStream::url('web/css/app.css'),
                'expectedVersion' => '',
                'expectedAssetUrl' => vfsStream::url('web/css/app.css'),
            ],
            [
                'incorrectManifestPath' => vfsStream::url(''),
                'correctFormat' => '%s?%s',
                'correctAssetPath' => vfsStream::url('web/css/app.css'),
                'expectedVersion' => '',
                'expectedAssetUrl' => vfsStream::url('web/css/app.css'),
            ],
            [
                'incorrectManifestPath' => vfsStream::url('web/incorrect/path/to/busters.json'),
                'correctFormat' => '%s?%s',
                'correctAssetPath' => vfsStream::url('web/css/app.css'),
                'expectedVersion' => '',
                'expectedAssetUrl' => vfsStream::url('web/css/app.css'),
            ],
            [
                'correctManifestPath' => vfsStream::url('web/busters.json'),
                'incorrectFormat' => 'QWE',
                'correctAssetPath' => vfsStream::url('web/css/app.css'),
                'expectedVersion' => 'styles-cache-key',
                'expectedAssetUrl' => 'QWE',
            ],
            [
                'correctManifestPath' => vfsStream::url('web/busters.json'),
                'incorrectFormat' => '%sABC',
                'correctAssetPath' => vfsStream::url('web/css/app.css'),
                'expectedVersion' => 'styles-cache-key',
                'expectedAssetUrl' => vfsStream::url('web/css/app.css') . 'ABC',
            ],
            [
                'correctManifestPath' => vfsStream::url('web/busters.json'),
                'correctFormat' => '%s?%s',
                'incorrectAssetPath' => vfsStream::url('web/css/incorrect/style.css'),
                'expectedVersion' => '',
                'expectedAssetUrl' => vfsStream::url('web/css/incorrect/style.css'),
            ],
            [
                'correctManifestPath' => vfsStream::url('web/busters.json'),
                'correctFormat' => '%s?%s',
                'correctAssetPath' => vfsStream::url('web/css/app.css'),
                'expectedVersion' => 'styles-cache-key',
                'expectedAssetUrl' => vfsStream::url('web/css/app.css') . '?styles-cache-key',
            ],
        ];
    }

    /**
     * @dataProvider getVersionProvider
     */
    public function testGetVestion($manifestPath, $format, $assetPath, $expectedVersion)
    {
        $busterVersionStrategy = new BusterVersionStrategy($manifestPath, $format);
        $actualVersion = $busterVersionStrategy->getVersion($assetPath);
        $this->assertEquals($expectedVersion, $actualVersion);
    }

    /**
     * @dataProvider getVersionProvider
     */
    public function testApplyVersion($manifestPath, $format, $assetPath, $expectedVersion, $expectedAssetUrl)
    {
        $busterVersionStrategy = new BusterVersionStrategy($manifestPath, $format);
        $actualAssetUrl = $busterVersionStrategy->applyVersion($assetPath);
        $this->assertEquals($expectedAssetUrl, $actualAssetUrl);
    }
}
