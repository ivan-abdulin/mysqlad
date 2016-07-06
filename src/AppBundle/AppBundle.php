<?php

namespace AppBundle;

use AppBundle\DependencyInjection\Compiler\OverrideAssetsDefaultPackagePass;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class AppBundle extends Bundle
{
    public function build(ContainerBuilder $container)
    {
        parent::build($container);

        if ($container->getParameter('kernel.environment') === 'prod') {
            $container->addCompilerPass(new OverrideAssetsDefaultPackagePass());
        }
    }
}
