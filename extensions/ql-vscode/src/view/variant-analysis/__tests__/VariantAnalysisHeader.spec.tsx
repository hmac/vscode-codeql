import * as React from 'react';
import { VariantAnalysisHeader, VariantAnalysisHeaderProps } from '../VariantAnalysisHeader';
import { render as reactRender, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VariantAnalysisStatus } from '../../../remote-queries/shared/variant-analysis';

describe(VariantAnalysisHeader.name, () => {
  const onOpenQueryFileClick = jest.fn();
  const onViewQueryTextClick = jest.fn();
  const onStopQueryClick = jest.fn();
  const onCopyRepositoryListClick = jest.fn();
  const onExportResultsClick = jest.fn();
  const onViewLogsClick = jest.fn();

  afterEach(() => {
    onOpenQueryFileClick.mockReset();
    onViewQueryTextClick.mockReset();
    onStopQueryClick.mockReset();
    onCopyRepositoryListClick.mockReset();
    onExportResultsClick.mockReset();
    onViewLogsClick.mockReset();
  });

  const render = (props: Partial<VariantAnalysisHeaderProps> = {}) =>
    reactRender(
      <VariantAnalysisHeader
        queryName="Query name"
        queryFileName="example.ql"
        variantAnalysisStatus={VariantAnalysisStatus.InProgress}
        totalRepositoryCount={10}
        onOpenQueryFileClick={onOpenQueryFileClick}
        onViewQueryTextClick={onViewQueryTextClick}
        onStopQueryClick={onStopQueryClick}
        onCopyRepositoryListClick={onCopyRepositoryListClick}
        onExportResultsClick={onExportResultsClick}
        onViewLogsClick={onViewLogsClick}
        {...props}
      />
    );

  it('renders correctly', () => {
    render();

    expect(screen.getByText('Query name')).toBeInTheDocument();
  });

  it('renders the query file name as a button', async () => {
    render();

    await userEvent.click(screen.getByText('example.ql'));
    expect(onOpenQueryFileClick).toHaveBeenCalledTimes(1);
  });

  it('renders a view query button', async () => {
    render();

    await userEvent.click(screen.getByText('View query'));
    expect(onViewQueryTextClick).toHaveBeenCalledTimes(1);
  });

  it('renders the stop query button when in progress', async () => {
    render({ variantAnalysisStatus: VariantAnalysisStatus.InProgress });

    await userEvent.click(screen.getByText('Stop query'));
    expect(onStopQueryClick).toHaveBeenCalledTimes(1);
  });

  it('renders the copy repository list button when succeeded', async () => {
    render({ variantAnalysisStatus: VariantAnalysisStatus.Succeeded });

    await userEvent.click(screen.getByText('Copy repository list'));
    expect(onCopyRepositoryListClick).toHaveBeenCalledTimes(1);
  });

  it('renders the export results button when succeeded', async () => {
    render({ variantAnalysisStatus: VariantAnalysisStatus.Succeeded });

    await userEvent.click(screen.getByText('Export results'));
    expect(onExportResultsClick).toHaveBeenCalledTimes(1);
  });

  it('does not render any buttons when failed', async () => {
    const { container } = render({ variantAnalysisStatus: VariantAnalysisStatus.Failed });

    expect(container.querySelectorAll('vscode-button').length).toEqual(0);
  });

  it('renders the view logs link when succeeded', async () => {
    render({
      variantAnalysisStatus: VariantAnalysisStatus.Succeeded,
      completedAt: new Date()
    });

    await userEvent.click(screen.getByText('View logs'));
    expect(onViewLogsClick).toHaveBeenCalledTimes(1);
  });
});
