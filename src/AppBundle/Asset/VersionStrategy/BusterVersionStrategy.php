<?php
namespace AppBundle\Asset\VersionStrategy;

use Symfony\Component\Asset\VersionStrategy\VersionStrategyInterface;

class BusterVersionStrategy implements VersionStrategyInterface
{
    /** @var string */
    private $manifestPath;

    /** @var string */
    private $format;

    /** @var string[] */
    private $hashes;

    /**
     * BusterVersionStrategy constructor.
     *
     * @param string $manifestPath
     * @param string $format
     */
    public function __construct($manifestPath, $format)
    {
        $this->manifestPath = $manifestPath;
        $this->format = $format;
    }

    /**
     * Returns the asset version for an asset.
     *
     * @param string $path A path
     *
     * @return string The version string
     */
    public function getVersion($path)
    {
        if (!is_array($this->hashes)) {
            $this->hashes = $this->loadManifest();
        }

        return $this->hashes[$path] ?? '';
    }

    /**
     * Applies version to the supplied path.
     *
     * @param string $path A path
     *
     * @return string The versionized path
     */
    public function applyVersion($path)
    {
        $version = $this->getVersion($path);

        if ($version === '') {
            return $path;
        }

        $versionized = sprintf($this->format, $path, $version);

        return $versionized;
    }

    /**
     * Loads json manifest
     *
     * @return string[] Array with file paths as keys and hashes as values
     */
    private function loadManifest()
    {
        $hashes = json_decode(file_get_contents($this->manifestPath), true);

        return $hashes;
    }
}
